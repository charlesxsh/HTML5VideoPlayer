function selectLocalVideo(vp, event) {
  var file = event.target.files[0];
  if(file) {
    console.log(file.name);
    URL.revokeObjectURL(url);
    url = URL.createObjectURL(file);
    vp.loadSrc(url, "video/mp4");
    return file;
  } else {
  	return undefined;
  }
}

function clickInputButton() {
	$('#input_select_video').click();
}

function uploadFile(file, socket) {
    if(file) {
      console.log("try to stream " + file.name);
      socket.emitVideoStream(file);
    }
}

function submitBullet(vp, socket) {
  var input = $('#bullet_submit input');
  var inputValue = input.val();
  
  input.val('');
  if(vp.isLoaded() && isPlayingCloudVideo) {
    var bullet = {
      comment: inputValue,
      time: vp.getCurrentVideoTime(),
      videoFileName: currentVideoFileName
    };
    console.log("emit bullet: " + inputValue);
    socket.emitBullet(bullet);
  } else {
    console.log("no cloud video is loaded");
  }
}

function queryVideo() {
  var i = $(this).index();
  var videoFileName = videoList[i].fileName;
  f = undefined;
  if(currentVideoFileName) {
    socket.emitLeaveRoom(currentVideoFileName);
  }
  socket.emitJoinRoom(videoFileName);
  
  ////TODO get all bullets
  $.get("bullet/"+videoFileName, function(bullets) {
    videoPlayer.addBulletsToVideo(JSON.parse(bullets));
  });

  vp.loadSrc("video/" + videoFileName, "video/mp4");
  isPlayingCloudVideo = true;
  currentVideoFileName = videoFileName;
}

      $('.VideoName').click(function() {

      });
