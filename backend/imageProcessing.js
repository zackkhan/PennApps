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
          //console.log('getdetections' + detections);
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
                //console.log(newState);
            })

        }).then(()=> {resolve(newState)})
    });



}

function routeImage(detection, image){
    //determines what should happen to image, promise
    return new Promise( (resolve, reject) => {
        if(detection == 'pedestrian crossing' || detection == 'pedestrian')
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

    return new Promise( (resolve, reject) => {
        kairosClient.recognize(params).then((result) => {
            if(result.body.Errors)
                reject('error'); //what would reject do?

            console.log(JSON.stringify(result));
            resolve(result.body.images[0].candidates[0].subject_id);

        });
    });
}

function countBills(image){
    //logos from bills, only works for different bills
    image = new Buffer(image, 'base64');
    var sum = 0;


    var options = {
        maxResults: 5,
        types: ['logos']
    };

    return new Promise( (resolve, reject) => {

        visionClient.detect(image, options, (err, logos, apiResponse) => {
            if(err){
              reject(err);

            }
            if(logos){
                if(logos.indexOf('USA 1 Dollar') > -1)
                    sum += 1;

                if(logos.indexOf('USA 5 Dollars') > -1)
                    sum += 5;

                if(logos.indexOf('USA 10 Dollars') > -1)
                    sum += 10

                if(logos.indexOf('USA 20 Dollars') > -1)
                    sum += 20;

                if(logos.indexOf('USA 50 Dollars') > -1)
                    sum += 50;

                if(logos.indexOf('USA 100 Dollar') > -1)
                    sum += 100;
            }


            resolve(sum);
        });

    });
}

function getCheckValue(image){
    image = new Buffer(image, 'base64');

    var options = {
        maxResults: 1,
        types: ['text']
    };

    return new Promise( (resolve, reject) => {

        visionClient.detect(image, options, (err, detections, apiResponse) => {
            if(err){
              reject(err);

          }
          //console.log('getdetections' + detections);
            resolve(detections.description);

        });

    });
}


module.exports = {
    'getDetections':getDetections,
    'analyzeDetections': analyzeDetections,
    'getPersonName': getPersonName,
    'countBills': countBills,
    'getCheckValue': getCheckValue

}
