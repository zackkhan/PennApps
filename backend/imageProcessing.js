const vision = require('@google-cloud/vision');
const Kairos = require('kairos-api');
const Promise = require('bluebird');
const crosswalk = require('./crosswalk')


var kairosClient = new Kairos('7b4f2c4d', 'b4e5353c1ce173ed46ed184ba610233f');


const jsonPath = __dirname + '/glassesPennApps-2b5e060d3bcd.json'

let visionClient = vision({
  projectId: 'glassespennapps@glassespennapps.iam.gserviceaccount.com',
  keyFilename: jsonPath
});

//var images = ['../Image%20Recognition/Objects/trash_can.JPG']
//
function getDetections(image){

    image = new Buffer(image, 'base64');

    var options = {
        maxResults: 20,
        types: ['labels']
    };

    return new Promise( (resolve, reject) => {

        visionClient.detect(image, options, (err, detections, apiResponse) => {
            if(err){
              reject(err);

          }
            resolve(detections);

        });

    });
}

function analyzeDetections(detections, image){
    //takes an array, returns object

    var actions = [];
    var newState = {};

    return new Promise( (resolve, reject) => {
        detections.forEach((value)=>{
            actions.push(routeImage(value, image))
        })


        Promise.all(actions).then((result)=>{
            result.forEach((obj) => {
                if(obj != 0)
                    newState = Object.assign(newState, obj);

            })

        }).then(()=> {resolve(newState)})
    });



}

function routeImage(detection, image){
    //determines what should happen to image, promise
    return new Promise( (resolve, reject) => {
        if(detection == 'pedestrian crossing')
            //console.log('routeImage');
            resolve(crosswalk.walkOrNoWalk(image));


        else
            resolve(0);



    });


}

function getPersonName(image){
    //sends image to kairos api, will return person's name, only for the 4 of us
    //image = 'http://graph.facebook.com/10203932289243476/picture?type=large';
    var params = {
      image: image,
      gallery_name: 'pennapps',

    };

    kairosClient.recognize(params).then((result) => {
        console.log(JSON.stringify(result));
        return req.body.images[0].candidates[0].subject_id;

    });

}
/*
function enroll(){
//
    console.log('enroll');
    var images = [ 'http://graph.facebook.com/10203932289243476/picture?type=large',
  'http://graph.facebook.com/1795540795/picture?type=large',
  'http://graph.facebook.com/100000000761263/picture?type=large',
  'http://graph.facebook.com/972929086085226/picture?type=large' ]

  //images.forEach((url) => {
      var params = {
        image: 'https://scontent.xx.fbcdn.net/v/t1.0-9/12143349_746922418774752_1782232485048935855_n.jpg?oh=2e41482b40cce77252674433ade67978&oe=591076C7',
        subject_id: 'tamer',
        gallery_name: 'pennapps'

      }
 // })

    kairosClient.enroll(params).then((result) => {
        console.log(JSON.stringify(result));
    });
}
*/

//getPersonName('hi');
module.exports = {
    'getDetections':getDetections,
    'analyzeDetections': analyzeDetections,
    'getPersonName': getPersonName

}
