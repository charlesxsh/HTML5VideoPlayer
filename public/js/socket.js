"use strict"

class Socket {
	constructor() {
		this.io = io();
	}

	//msg: an object {comment: value, time: value}
	emitBullet(msg) {
		this.io.emit('bullet', msg);
	}

	onBullet(callback) {
		this.io.on('bullet', callback);
	}

	emitVideoStream(file) {
		var stream = ss.createStream();
        // upload a file to the server. 
        ss(this.io).emit('video', stream, {size: file.size, name: file.name});
        var blobStream = ss.createBlobReadStream(f);

        //track progress
        var size = 0;
        blobStream.on('data', function(chunk) {
            size += chunk.length;
            console.log(Math.floor(size / f.size * 100) + '%');
        });

        blobStream.pipe(stream);		
	}

	onVideoStream(callback) {
		//TODO implement it
	}
}

