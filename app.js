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
  var object = {
    "path": [
      {
        "id" : 1,
        "latitude" : 42.29386,
        "longitude" : -71.26483,
        "s3id" : "MVI_3146.3gp"
      },
      {
        "id" : 2,
        "latitude" : 42.292987,
        "longitude" : -71.264039,
        "s3id" : "MVI_3145.3gp"
      },
      {
        "id" : 3,
        "latitude" : 42.292733,
        "longitude" : -71.263977,
        "s3id" : "MVI_3144.3gp"
      },
      {
        "id" : 4,
        "latitude" : 42.293445,
        "longitude" : -71.263481,
        "s3id" : "MVI_3147.3gp"
      },
      {
        "id" : 5,
        "latitude" : 42.293108,
        "longitude" : -71.262802,
        "s3id" : "MVI_3141.3gp"
      },
      {
        "id" : 6,
        "latitude" : 42.292701,
        "longitude" : -71.262054,
        "s3id" : "MVI_3140.3gp"
      }
    ]
  };
  res.json(object);
});

app.post('/userdata/:appId', function(req, res) {
  var appId = req.params.appId;
  var imageUrl = req.body.imageUrl;
  var imageLocation = req.body.imageLocation

  if (imageUrl == null || imageLocation == null) {
    res.json({"error":"Set the imageUrl and imageLocation in the body"});
  }
  
  console.log(appId);
  // here we shall get the user's data and save it to mongo
  AppModel.findOne({ 'appId' : appId }, function(err, a) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!a) {
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
      res.json({'data':images});
      return;
    }
  });
});

var url = "0.0.0.0";
var port = process.env.PORT || 8080;

app.listen(port, url);
console.log('Express started on port ' + port + " at " + url);