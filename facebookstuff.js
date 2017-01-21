var fbgraph = require("./fbgraph.js");
var https = require('https');
var http = require('http');

fbgraph.getFbData('EAACEdEose0cBAAUgYrSiRIveVpjGJaRukqwXm1yJ7czjFJ9W7qt2z7kKo3EaCQ8Sc6QH815F8xBvU76pKws6alsmuIkf0ZAtmk24slGzBftEvi5ZANANRlYOZAJG4TUFwIJKZBWI8mSV50GCZBiOwTrLzjO58hcRfYdO09I4evpRHeq8gkvhXBQizwd7DArQZD',
 '/me/friends', function(data){
    console.log(data);
  //  var x = '<img src="//graph.facebook.com/1795540795/picture?type=large">';
  //  var server = http.createServer(function(request, response) {response.write(data)});
  //  server.listen(80);
});

//https://graph.facebook.com/me/friends?access_token=[oauth_to‌​ken]&fields=name,id,‌​picture.type(large)
