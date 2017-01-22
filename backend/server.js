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
app.set('sensorData', {frontDistance: -1, leftDistance: -1, rightDistance: -1});
//initialize with tamer
app.set('currImage', 'data:image/jpeg;base64,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');
app.set('touchStatus', '-1');



server.listen(port, () => {
  console.log('App is online on ' + port);
});

//sensors (ultrasonic)


app.get('/getSensorData', (req, res) => {
    res.send(JSON.stringify(app.get('sensorData')));
});

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


app.get('/whatIsThat', (req, res) => {
    res.send(app.get('firstDetection'));
});

app.get('/whoIsThat', (req, res) => {
    imageAPI.getPersonName(app.get('currImage')).then((name) => {
        console.log(name);
        res.send(name);
    })
});

app.get('/countMoney', (req, res) => {
    imageAPI.countBills(app.get('currImage')).then((sum) => {
        console.log(sum);
        res.send(sum.toString());
    })
})


app.get('/crosswalkStatus', (req,res) => {
    if(!app.get('crosswalkStatus')){
        res.send('do not cross')
    } else {
        res.send('cross')
    }

})

//for touch sensor

app.get('/touchStatus', (req,res) => {
    res.send(app.get('touchStatus'));
});

app.post('/touchSensor', (req,res) => {
    app.set('touchSensor', req.body.touchSensor);

})

app.post('/processCheck', (req, res) => {
    imageAPI.getCheckValue(app.get('currImage')).then((value) => {
        console.log(value);
        res.send(value);
    })
});

//io with images

io.on('connection', (socket) => {
  //io.emit('this', { will: 'be received by everyone'});


  socket.on('send-image', (image) => {
    //do stuff with image (i.e. apis)
    console.log('image received');
    var status = {};
    app.set('currImage', image);


    imageAPI.getDetections(image).then( (detections) => {
        app.set('firstDetection', detections[0]);

        imageAPI.analyzeDetections(detections, image).then( (status) => {
            //console.log('analyze' + status)
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
 socket.on('send-sensor-data', (sensorData) => {
     console.log(sensorData);
     app.set('sensorData', sensorData);
 });

  socket.on('disconnect', function () {
      console.log("disconnected")
  });
});
