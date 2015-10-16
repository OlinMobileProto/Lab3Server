var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
	'imageKey' : String,
	'imageLocation' : String
});

var appSchema = mongoose.Schema({
	'appId' : String,
	'userImages' : [imageSchema]
});

module.exports = {
	'AppModel' : mongoose.model('AppModel', appSchema),
	'ImageModel' : mongoose.model('ImageModel', imageSchema)
};