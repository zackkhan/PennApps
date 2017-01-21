'use strict';

//express
var app = require('express')();
var server = require('http').Server(app);
//socket.io
var io = require('socket.io')(server);
//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


const port = process.env.PORT || 3000;

io.on('connection',  (socket) => {
  //io.emit('this', { will: 'be received by everyone'});

  socket.on('send-image', (image) => {
    console.log('image received');
    console.log(image.hello);
    //do stuff with image
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});


app.get('/test', function(request, response) {
  console.log('test request received');
  response.send('test complete');
});


app.listen(port, () => {
  console.log('App is online on ' + port);
});
