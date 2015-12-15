function handleBullet(videoPlayer,socket){
	
	//dynamically receive a bullet
	socket.onBullet(function (msg) {
		videoPlayer.dyAddBulletToVideo({"comment":msg.comment,"time":msg.time});
	});

};

