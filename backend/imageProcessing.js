const vision = require('@google-cloud/vision');
const Promise = require('bluebird');
const crosswalk = require('./crosswalk')

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
                if(obj != 0){
                    newState = Object.assign(newState, obj);
                }
            })

        }).then(()=> {resolve(newState)})
    });



}

function routeImage(detection, image){
    //determines what should happen to image, promise
    return new Promise( (resolve, reject) => {
        if(detection == 'pedestrian crossing'){
            //console.log('routeImage');
            resolve(crosswalk.walkOrNoWalk(image))
        }

        else {
            resolve(0)
        }


    });


}

module.exports = {
    'getDetections':getDetections,
    'analyzeDetections': analyzeDetections

}
