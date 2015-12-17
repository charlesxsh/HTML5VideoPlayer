"use strict"

const EVENT = {
	BULLET: 'bullet',
	CHAT: 'chat',
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

	emitChat(msg) {
		this.socket.emit(EVENT.CHAT, msg);
	}

	onChat(callback) {
		this.socket.on(EVENT.CHAT, callback);
	}

	emitVideoStream(file) {
		var stream = ss.createStream();
        // upload a file to the server. 
        ss(this.socket).emit(EVENT.VIDEO_UPLOAD, stream, {size: file.size, name: file.name});
        var blobStream = ss.createBlobReadStream(file);

        //track progress
        var size = 0;
        blobStream.on('data', function(chunk) {
            size += chunk.length;
            console.log(Math.floor(size / file.size * 100) + '%');
            if(size === file.size) {
            	$('#upload_video').html(
		        	"<a>" +
		          		"<span class='mif-cloud-upload icon'></span>" +
		            	" Upload Video" +
		        	"</a>"
		      );
            }
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

