var io = require('socket.io-client');
var socket = io('penn-apps.herokuapp.com:51356');


var base64 = require('node-base64-image');

var path = __dirname + '\\image.jpg';

options = {string: true, local: true};

base64.encode(path, options, function (err, image) {
    if (err) {console.log(err); }
console.log(image);
  socket.emit('send-image', image);

});
