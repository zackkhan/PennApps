
function walkOrNoWalk(image){
    //talks to trained api
    //returns true false value in form of promise
    //image = new Buffer(image, 'base64')
    return {'crosswalkStatus': true}; //true means crossing is ok
}



module.exports = {
    'walkOrNoWalk' : walkOrNoWalk
}
