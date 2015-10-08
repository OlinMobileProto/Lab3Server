var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
	's3id' : String,
	'placeId' : String
});

var appSchema = mongoose.Schema({
	'appId' : String,
	'userImages' : imageSchema
});

module.exports = {
	'AppModel' : mongoose.model('AppModel', appSchema),
	'ImageModel' : mongoose.model('ImageModel', imageSchema)
};