const vision = require('@google-cloud/vision');
const Promise = require('bluebird');

const jsonPath = __dirname + '/glassesPennApps-2b5e060d3bcd.json'

let visionClient = vision({
  projectId: 'glassespennapps@glassespennapps.iam.gserviceaccount.com',
  keyFilename: jsonPath
});

function getDetections(image){

    return new Promise( (resolve, reject) => {

        visionClient.detect(image, options, (err, detections, apiResponse) => {
            if(err){
              reject(err);

            }
            resolve(detections);

        });

    });
}

module.exports = {

}
