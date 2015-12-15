function handleBullet(videoPlayer,socket){
	
	//dynamically receive a bullet
	socket.onBullet(function (msg) {
		videoPlayer.addBulletToVideo({"comment":msg.comment,"time":msg.time});
	});

};

