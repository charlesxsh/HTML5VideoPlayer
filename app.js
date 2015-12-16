//require modules
var express = require('express');
var http = require('http');

var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var ffmpeg = require('fluent-ffmpeg');



var BulletDatabase = require('./database');
var ServerSocketManager = require('./ServerSocketManager');

//set up
var app = express();
var httpServer = http.Server(app);
var bulletDB = new BulletDatabase();
var socketManager = new ServerSocketManager(httpServer, bulletDB);


//init
bulletDB.init();
socketManager.initSocket();

var port = process.env.PORT || 3000;

//get video screen shot
function getScreenshot(videopath,)
{
  var proc = new ffmpeg(videopath)
  .takeScreenshots({
      count: 1,
      timemarks: [ '5' ] // number of seconds
    }, '/path/to/thumbnail/folder', function(err) {
    console.log('screenshots were saved')
  });
}
//middle ware
function log(req, res, next) {
  console.log('req: '+req.originalUrl);
  next();
}

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(log);


//routing
app.get('/video-list', function(req, res) {
  //get video list from server
  var videoList = fs.readdirSync('public/video/');
  console.log("videoList: "+videoList);
  if(videoList.length > 0) {
    bulletDB.selectAllVideoInfoAndSend(res);
  }
});

//routes to a specific video file and create a socekt.io namespace with it
app.get('/bullet/*', function(req, res) {
  console.log('bullet req: '+req.originalUrl);
  var path = req.originalUrl.split('/');
  //console.log(path);
  
  bulletDB.selectAllBulletFromVideoAndSend(res, path[2]);
});


//start server
httpServer.listen(port, function() {
	console.log('listening on port: ' + port);
});

process.on('SIGINT', function() {
  bulletDB.db.close();
  process.exit();
});

process.on('exit', function (){
  console.log('Goodbye!');
});
