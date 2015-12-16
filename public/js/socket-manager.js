"use strict"

const EVENT = {
	BULLET: 'bullet',
	VIDEO_UPLOAD: 'video upload',
	VIDEO_DOWNLOAD: 'video download',
	JOIN_ROOM: 'join room',
	LEAVE_ROOM: 'leave room'
}


/* Client Socket Manager */
class SocketManager {

	constructor() {
		this.socket;
	}

	initSocket() {
		this.socket = io();
	}

	//msg: an object {comment: value, time: value}
	emitBullet(msg) {
		this.socket.emit(EVENT.BULLET, msg);
	}

	onBullet(callback) {
		this.socket.on(EVENT.BULLET, callback);
	}

	emitVideoStream(file) {
		var stream = ss.createStream();
        // upload a file to the server. 
        ss(this.socket).emit(EVENT.VIDEO_UPLOAD, stream, {size: file.size, name: file.name});
        var blobStream = ss.createBlobReadStream(f);

        //track progress
        var size = 0;
        blobStream.on('data', function(chunk) {
            size += chunk.length;
            console.log(Math.floor(size / f.size * 100) + '%');
        });

        blobStream.pipe(stream);		
	}

	emitJoinRoom(room) {
		this.socket.emit(EVENT.JOIN_ROOM, room);
	}

	onJoinRoom(callback) {
		this.socket.on(EVENT.JOIN_ROOM, callback);
	}

	emitLeaveRoom(room) {
		this.socket.emit(EVENT.LEAVE_ROOM, room);
	}

	onLeaveRoom(callback) {
		this.socket.on(EVENT.LEAVE_ROOM, callback);
	}
}

