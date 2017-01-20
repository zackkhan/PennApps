
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

var port = process.env.PORT || 3000;

io.on('connection',  (socket) => {
  //io.emit('this', { will: 'be received by everyone'});

  socket.on('receiving images', (args) => {
    //do some stuff
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});


app.listen(port, () => {
  console.log('App is online');
});
