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

  loadVideoList(videoPlayer, socket);
  registerListeners(socket, videoPlayer);
  handleBullet(videoPlayer, socket);
  handleChat(socket);
}

function loadVideoList(vp, socket) {
  $.ajax({
    url: "video-list",
    success: function(data) {
    	videoList = JSON.parse(data);
    	videoList.forEach(function(element, index) {
    	// 	$("#video_list").append(
					// "<li class='VideoName'>" +
     //        "<a>" +
     //          "<span class='mif-film icon'></span>" +
     //          element.title +
     //        "</a>" +
     //      "</li>"
     //    );
        populateVideoTable(element, index);
    	});

    	 //search video from server
		  $('.VideoName').click({socket: socket, videoPlayer: videoPlayer} ,queryVideo);
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

  $('#bullet_submit button').click(socket ,submitBullet);
  $('#bullet_submit input').keypress(socket ,submitBullet);

  $('#chat_submit button').click(socket ,submitChat);
  $('#chat_submit input').keypress(socket, submitChat);
}
