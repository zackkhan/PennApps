const vision = require('@google-cloud/vision');
const Promise = require('bluebird');
const crosswalk = require('./crosswalk')

const jsonPath = __dirname + '/glassesPennApps-2b5e060d3bcd.json'

let visionClient = vision({
  projectId: 'glassespennapps@glassespennapps.iam.gserviceaccount.com',
  keyFilename: jsonPath
});

//var images = ['../Image%20Recognition/Objects/trash_can.JPG']

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
    //takes an array

    image = new Buffer(image, 'base64')

    detections..forEach( (value) => {
       if(value == 'pedestrian crosswalk'){
           crosswalk.walkOrNoWalk(image);
       }
    });

}

module.exports = {
    'getDetections':getDetections

}
