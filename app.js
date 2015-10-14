var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// config mongoose
var dbConfig = require('./config/db');
mongoose.connect(dbConfig.url);

// data schemas
var AppModel = require('./models/appModel').AppModel;
var ImageModel = require('./models/appModel').ImageModel;

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/sawyerssecretroute', function(req, res) {
  res.send("This is a secret. Go back.");
});

app.get('/scavengerhunt', function(req, res) {
  var object = {'path':['HI', 'Hello']};
  res.json(object);
});

app.post('/userdata/:appId', function(req, res) {
  var appId = req.params.appId;
  var imageUrl = req.body.imageUrl;
  var imageLocation = req.body.imageLocation
  
  console.log(appId);
  // here we shall get the user's data and save it to mongo
  AppModel.findOne({ 'appId' : appId }, function(err, a) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!a) {
      console.log("NO APP");
      var imageModel = new ImageModel();
      imageModel.url = imageUrl;
      imageModel.imageLocation = imageLocation;
      var newApp = new AppModel();

      newApp.appId = appId;
      newApp.userImages = [imageModel]; // TODO: Add image from imagePath, imageLocation

      newApp.save(function(err) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
        return;
      });
    } else {
      console.log("APP");
      var imageModel = new ImageModel();
      imageModel.url = imageUrl;
      imageModel.imageLocation = imageLocation;
      a.userImages.push(imageModel);

      a.save(function(err) {
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
        return;
      });
    }
  });
});

app.get('/userdata/:appId', function(req, res) {
  var appId = req.params.appId;

  console.log(appId);
  // here we shall get the users data from mongo and return this to the app.
  AppModel.findOne({ 'appId' : appId }, function(err, app) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!app) {
      console.log("NO app");
      var newApp = new AppModel();

      newApp.appId = appId;
      newApp.userImages = []; 

      newApp.save(function(err) {
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
    } else {
      var images = app.userImages;
      console.log(images);
      res.json({'data':images);
      return;
    }
  });
});

var port = process.env.PORT || 8080;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});