var fbgraph = require("./fbgraph.js");
var https = require('https');
var http = require('http');

fbgraph.getFbData('EAACEdEose0cBAK0uTAp1OFnYjPZCKUpFocviRLY0Ibmqz3fRtCBd7yodlymC28bbWq7i8y4nGZCY4Wq2QDUURdKkwDOZAXjSM7tvD88GaTMoG04vYG7NZC45LHs01uXKZBYotTYzGq9saSL9RkwUmQzNXB7dcbhZAojw5I4i1zGIOZC7EWpyTySLyWFuNQqVx0ZD',
 '/me/friends', function(data){
    console.log(data);


  //  var x = '<img src="http://graph.facebook.com/1795540795/picture?type=large">';
  //  var server = http.createServer(function(request, response) {response.write(data)});
  //  server.listen(80);
});

var z = [{"name":"Danny Flax","id":"10203932289243476"},{"name":"Michael Anderjaska","id":"10207802598643904"},{"name":"Sashank Thupukari","id":"1795540795"},
{"name":"Ramsey Khadder","id":"100000000761263"},{"name":"Vineet Shah","id":"972929086085226"},{"name":"Travis Ho","id":"1329153543809773"},{"name":"Tamer Bader","id":"785445504922443"}]

//https://graph.facebook.com/me/friends?access_token=[oauth_to‌​ken]&fields=name,id,‌​picture.type(large)

var imgList = [];
for (i=0; i<z.length; i++)
{
  imgList.push("http://graph.facebook.com/" + z[i].id + "/picture?type=large");
}
console.log(imgList);
module.exports = imgList;
