'use strict';

var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//require("babel-core");

var port = process.env.PORT || 5000;

app.use(bodyParser.json());

server.listen(port, () => {
  console.log('App is online on ' + port);
});

app.get('getPort', (req, res) =>{
    res.send(JSON.stringify({'port': port});
    
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

//io with images

io.on('connection',  (socket) => {
  //io.emit('this', { will: 'be received by everyone'});


  socket.on('send-image', (image) => {
    //do stuff with image (i.e. apis)
    console.log('image received');
  });

  socket.on('disconnect', function () {
      console.log("disconnected")
  });
});
