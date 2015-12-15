"use strict"

var socketio = require('socket.io');
var ss = require('socket.io-stream');
var fs = require('fs');

const EVENT = {
	BULLET: 'bullet',
	VIDEO_UPLOAD: 'video upload',
	VIDEO_DOWNLOAD: 'video download',
	JOIN_ROOM: 'join room',
	LEAVE_ROOM: 'leave room'
}

class ServerSocketManager {

	constructor(httpServer, bulletDB) {
		this.io = socketio(httpServer);
		this.bulletDB = bulletDB;
	}

	initSocket() {
		var io = this.io;
		var bulletDB = this.bulletDB;

		io.on('connection', function(socket){
		  console.log('a user connected');
		  socket.broadcast.emit('Hi everybody!');
		  socket.join();

		  socket.on('disconnect', function() {
		  	console.log('user disconnected');
		  });

		  ss(socket).on(EVENT.VIDEO_UPLOAD, function(stream, data) {
		    console.log('video: ' + data.name);
		    var fileName = "video"+Date.now().toString();
		    bulletDB.insertNewVideoFile(fileName, data.name);
		    bulletDB.createNewBulletTable(fileName);
		    //TODO: should check no problem happens before pipe it into writable stream
		    stream.pipe(fs.createWriteStream("public/video/" + fileName));
		  });

		  //this msg should be an object
		  socket.on(EVENT.BULLET, function(msg) {
		  	console.log('bullet: ' + JSON.stringify(msg));
		    bulletDB.insertNewBullet(msg);
		  	io.to(msg.videoFileName).emit(EVENT.BULLET, msg);
		  });

		  socket.on(EVENT.JOIN_ROOM, function(msg) {
		  	console.log("join room: " + msg);
		  	socket.join(msg);
		  });

		  socket.on(EVENT.LEAVE_ROOM, function(msg) {
		  	console.log("leave room: " + msg);
		  	socket.leave(msg);
		  });
		});
	}
}


module.exports = ServerSocketManager;
