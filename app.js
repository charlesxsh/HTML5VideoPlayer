//require modules
var express = require('express');
var http = require('http');

var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var socketio = require('socket.io');
var ss = require('socket.io-stream');

//set up
var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);


//init
var port = process.env.PORT || 3000;
const EVENT = {
  BULLET: 'bullet',
  VIDEO_UPLOAD: 'video upload',
  VIDEO_DOWNLOAD: 'video download',
}


//middle ware
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//routing
app.get('/video', function(req, res) {
  //get video from server
});

app.get('/video-list', function(req, res) {
  //get video from server
  var videoList = fs.readdirSync('public/video/');
  console.log(videoList);
  res.end(JSON.stringify(videoList));
});


//socket io
io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('Hi everybody!');

  socket.on('disconnect', function() {
  	console.log('user disconnected');
  });

  //this msg should be an object
  //{comment: value, time: value}
  socket.on(EVENT.BULLET, function(msg) {
  	//var json = JSON.parse(msg);
  	console.log('bullet: ' + JSON.stringify(msg));
  	io.emit(EVENT.BULLET, msg);
  });

  ss(socket).on(EVENT.VIDEO_UPLOAD, function(stream, data) {
    console.log('video: ' + data.name);

    // stream.on('data', function(chunk) {
    //   console.log('got %d bytes of data', chunk.length);
    // });
    stream.pipe(fs.createWriteStream("public/video/" + data.name));
  });
});


//start server
httpServer.listen(port, function() {
	console.log('listening on port: ' + port);
});
