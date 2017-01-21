var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require("body-parser");
var io = require('socket.io-client');
//var socket = io('penn-apps.herokuapp.com:51356');
var socket = null;

//file stuff
var base64 = require('node-base64-image');
var fs = require('fs')

//syscall
var spawn = require('child_process').spawn;
var proc;

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

var path = __dirname + '/image.jpg';
options = {string: true, local: true};


request('http://penn-apps.herokuapp.com/getPort',  (error, response, body) => {
  if (!error && response.statusCode == 200) {
    socket = io('http://penn-apps.herokuapp.com:' + body.port);
    console.log('client connected to port ' + body.port) // Show the HTML for the Google homepage.

  }
})

//while(socket == null){};
/*
socket.on('connect', function(){
    console.log('connected!')
});

socket.on('start-streaming', () => {
   console.log('streaming initialized')
   startStreaming();
});

socket.on('end-streaming', () => {
   console.log('streaming terminated')
   stopStreaming();
});

*/
//sends image to backend
function sendImage(){
    base64.encode(path, options, function (err, image) {
        if (err) {console.log(err); }

       socket.emit('send-image', image);

    });
}


function stopStreaming() {

    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile(path);

}

function startStreaming() {

  if (app.get('watchingFile')) {
    sendImage();
    return;
  }
  /*
  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args);
  */
  console.log('Watching for changes...');

  app.set('watchingFile', true);

  fs.watchFile(path, function(current, previous) {
    sendImage();
  })

}
