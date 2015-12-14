//require modules
var express = require('express');
var http = require('http');

var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var socketio = require('socket.io');
var ss = require('socket.io-stream');

var BulletDatabase = require('./database');

//set up
var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);
var bulletDB = new BulletDatabase();


//init
bulletDB.init();

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
  console.log("videoList: "+videoList);

  if(videoList.length > 0) {
    bulletDB.db.all("SELECT rowid AS id, fileName, title FROM files", function(err, rows) {
      if (err) throw err;
      if(rows.length > 0) {
        console.log(rows);
        var videoEntries = [];
        for(var i = 0; i < rows.length; i++) {
          videoEntries.push({fileName: rows[i].fileName, title: rows[i].title});
          console.log(rows[i]);
        }
        res.end(JSON.stringify(videoEntries));
      }
    });
  }
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
    bulletDB.db.run("INSERT INTO "+ msg.videoFileName +" VALUES ($comment, $time)", {
      $comment: msg.comment,
      $time: msg.time}
    );
  	io.emit(EVENT.BULLET, msg);
  });

  ss(socket).on(EVENT.VIDEO_UPLOAD, function(stream, data) {
    console.log('video: ' + data.name);

    // stream.on('data', function(chunk) {
    //   console.log('got %d bytes of data', chunk.length);
    // });
    var fileName = "video"+Date.now().toString();
    stream.pipe(fs.createWriteStream("public/video/" + fileName));
    bulletDB.db.run("INSERT INTO files VALUES ('"+ fileName +"','"+ data.name +"')");
    bulletDB.db.run(
      "CREATE TABLE IF NOT EXISTS "+fileName+" ("+
        "comment TEXT, " +
        "time INT" +
      ")"
    );
  });
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
