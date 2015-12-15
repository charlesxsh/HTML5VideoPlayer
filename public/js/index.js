var url;
var f; //video file
var isPlayingCloudVideo = false;
var videoList;
var currentVideoFileName;
var videoPlayer;

window.onload = function() {

  var socket = new SocketManager();
  socket.initSocket();

  videoPlayer = new VideoPlayer(document.getElementById('playerarea'));
  init();
  
  loadVideoList(videoPlayer);
  registerListeners(socket, videoPlayer);
  handleBullet(videoPlayer, socket);
}

function loadVideoList(vp, socket) {
  $.ajax({
    url: "video-list",
    success: function(data) {
    	videoList = JSON.parse(data);
    	videoList.forEach(function(element) {
    		$("#video_list").append(
					"<li class='VideoName'>" +
            "<a>" +
              "<span class='mif-film icon'></span>" +
              element.title +
            "</a>" +
          "</li>"
        );
    	});

    	 //search video from server
		  $('.VideoName').click(function() {
        var i = $(this).index();
		    var videoFileName = videoList[i].fileName;
		    f = undefined;
        if(currentVideoFileName) {
          socket.emitLeaveRoom(currentVideoFileName);
        }
        socket.emitJoinRoom(videoFileName);
        
        ////TODO get all bullets
        $.get("bullet/"+videoFileName, function( data ) {
          console.log('get bullet: ' + data);
        });

		    vp.loadSrc("video/" + videoFileName, "video/mp4");
        isPlayingCloudVideo = true;
        currentVideoFileName = videoFileName;
		  });
    }
  });
}

function registerListeners(socket, vp) {
  document.getElementById('input_select_video').addEventListener('change', function(event) {
    f = selectLocalVideo(vp, event);
  });

  $('#select_video').click(clickInputButton);

  $('#upload_video').click(function() {
    uploadFile(f, socket);
  });

  $('#bullet_submit button').click(function() {
    submitBullet(vp, socket);
  });
}
