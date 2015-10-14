# Lab3Server
This is the server for lab 3. 

## Routes

All routes return 500 for error. 

### GET /scavengerhunt

Use this route to get the scavenger hunt route, locations, and video clues. 

This route takes no parameters, and returns data in the following format:

``` JSON
{
	"path": [
		{
			"id" : id,
			"latitude" : latitude,
			"longitude" : longitude,
			"s3id" : s3id
		}, ...
	]
}
```

id is the number of the place, in order from 1 to the number of clues. s3id is the id of the video clue in the s3 bucket. 

### GET /userdata/<appId>

Use this route to get an array of images that have been uploaded to s3 from your app. 

This route takes the appId as a part of the url. You should code the appId in your app, simply choose it yourself but make sure that it is unique to you (i.e. add your names or make it really long). It returns data in the following format:

``` JSON
{
	"data": [
		{
			"imageLocation" : imageLocation,
			"url" : url
		}, ...
	]
}
```

imageLocation is the number of the location, from 1 to the number of clues. For example, a imageLocation of 3 means that the image was taken at the 3rd location. url is the URL of the image.

### POST /userdata/<appId>

Use this route after you"ve uploaded a picture to s3, and now you are ready to save the image URL and location on the server. 

This route takes the appId as a part of the url. You should code the appId in your app, simply choose it yourself but make sure that it is unique to you (i.e. add your names or make it really long). It also takes a body in the following format:

``` JSON
{
	"imageUrl": imageUrl,
	"imageLocation": imageLocation
}
```

imageUrl is the url of the image that was uploaded. imageLocation is the number of the location, from 1 to the number of clues. For example, an imageLocation of 3 means that the image was taken at the 3rd location. 


It returns either a 200 status code for success or a 500 status code for error. 


