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


//middle ware
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//routing
app.get('/test', function(req, res) {
	console.log('/test');
	res.sendFile(path.join(__dirname, '/public/test.html'));
});


//socket io
io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('Hi everybody!');

  socket.on('disconnect', function() {
  	console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
  	console.log('message: ' + msg);
  	io.emit('chat message', msg);
  });

  //this msg should be a json string
  //{comment: value, time: value}
  socket.on('bullet', function(msg) {
  	var json = JSON.parse(msg);
  	console.log('bullet: ' + json);
  	io.emit('bullet', msg);
  });

  ss(socket).on('video', function(stream, data) {
    console.log('video: ' + data.name);
    stream.pipe(fs.createWriteStream("public/video/" + data.name));
  });
});


//start server
httpServer.listen(port, function() {
	console.log('listening on port: ' + port);
});
