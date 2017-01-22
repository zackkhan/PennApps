'use strict';

var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var imageAPI = require('./imageProcessing');
var sensorAPI = require('./sensorProcessing');

var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.set('crosswalkStatus', true); //true means okay to cross
app.set('sensorData', {});
app.set('currImage', '');
app.set('touchStatus', '-1');

/*
app.set('leftDistance', -1); //distance sensors
app.set('frontDistance', -1);
app.set('rightDistance', -1);
*/






server.listen(port, () => {
  console.log('App is online on ' + port);
});

app.get('/getPort', (req, res) =>{
    console.log('port');
    res.send({
        'port': port
    });
})

app.get('/test', function(request, response) {
  console.log('test request received');
  response.send('test complete');
});

app.get('/startStream', (req, res) => {
    io.emit('start-streaming');
    res.sendStatus(200);
})

app.get('/endStream', (req, res) => {
     io.emit('end-streaming');
     res.sendStatus(200);
})



app.get('/whatIsThat', (req,res) => {
    res.send(app.get('firstDetection'));
});

app.get('/whoIsThat', (req,res) => {
    imageAPI.getPersonName(app.get('currImage')).then((name) => {
        res.send(name);
    })
});


app.get('/crosswalkStatus', (req,res) => {
    if(!app.get('crosswalkStatus')){
        res.send('do not cross')
    } else {
        res.send('cross')
    }

})

app.get('/touchStatus', (req,res) => {
    res.send(app.get('touchStatus'));
});

app.post('/touchSensor', (req,res) => {
    app.set('touchSensor', req.body.touchSensor);

})

//io with images

io.on('connection', (socket) => {
  //io.emit('this', { will: 'be received by everyone'});


  socket.on('send-image', (image) => {
    //do stuff with image (i.e. apis)
    //console.log('image received');
    var status = {};
    app.set('currImage', image);


    imageAPI.getDetections(image).then( (detections) => {
        app.set('firstDetection', detections[0]);

        imageAPI.analyzeDetections(detections, image).then( (status) => {
            ///console.log(status.crosswalkStatus)
            app.set('crosswalkStatus', status.crosswalkStatus)
        })
        //must somehow result in an alert
    })
  });
/*
  socket.on('send-sensor-data', (values) => {
      app.set('sensorData', values); //distance sensors
      //respond to sensor data


  });
*/
  socket.on('disconnect', function () {
      console.log("disconnected")
  });
});
