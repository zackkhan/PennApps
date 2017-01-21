'use strict';

var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


var imageAPI = require('./imageProcessing');

var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.set('crosswalkStatus', true); //true means okay to cross

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

app.post('/sensorData', (req,res) =>{
    //do something with our sensor data
})

app.get('/whatIsThat', (req,res) => {
    res.send(app.get('firstDetection'));
});

app.get('/crosswalkStatus', (req,res) => {


    if(!app.get('crosswalkStatus')){
        res.send('do not cross')
    } else {
        res.send('cross')
    }

})

//io with images

io.on('connection', (socket) => {
  //io.emit('this', { will: 'be received by everyone'});


  socket.on('send-image', (image) => {
    //do stuff with image (i.e. apis)
    console.log('image received');
    var status = {};

    imageAPI.getDetections(image).then( (detections) => {
        app.set('firstDetection', detections[0]);

        imageAPI.analyzeDetections(detections, image).then( (status) => {
            ///console.log(status.crosswalkStatus)
            app.set('crosswalkStatus', status.crosswalkStatus)
        })
        //must somehow result in an alert
    })
  });

  socket.on('disconnect', function () {
      console.log("disconnected")
  });
});
