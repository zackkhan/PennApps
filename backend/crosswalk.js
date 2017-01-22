var watson = require('watson-developer-cloud');

var visual_recognition = watson.visual_recognition({
  api_key: '7fdd5475b2518cc0080389eb5faf6e034d0db7bd',
  version: 'v3',
  version_date: '2016-05-20'

});


function walkOrNoWalk(image){

    //talks to trained api
    //returns true false value in form of promise
    image = new Buffer(image, 'base64')
    var params = {
      images_file: image,
      classifier_ids: 'crosswalks_47100108',
      owner: 'b641e65f-9aa8-41be-a238-ee73f4bc2475'
    };

    visual_recognition.classify(params, function(err, res) {
      if (err){
          console.log(err);
      } else {
          console.log(JSON.stringify(res, null, 2));
          if(res.images[0].classifiers[0].classes[0].class == 'go')
           return {'crosswalkStatus': true};
          else
          return {'crosswalkStatus': false};
      }

    });

     //true means crossing is ok
}



module.exports = {
    'walkOrNoWalk' : walkOrNoWalk
}
