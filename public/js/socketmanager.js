"use strict"

class SocketManager {

	constructor() {
		this.io = io();
	}

	//msg: an object {comment: value, time: value}
	emitBullet(msg) {
		this.io.emit(EVENT.BULLET, msg);
	}

	onBullet(callback) {
		this.io.on(EVENT.BULLET, callback);
	}

	emitVideoStream(file) {
		var stream = ss.createStream();
        // upload a file to the server. 
        ss(this.io).emit(EVENT.VIDEO_UPLOAD, stream, {size: file.size, name: file.name});
        var blobStream = ss.createBlobReadStream(f);

        //track progress
        var size = 0;
        blobStream.on('data', function(chunk) {
            size += chunk.length;
            console.log(Math.floor(size / f.size * 100) + '%');
        });

        blobStream.pipe(stream);		
	}
}

