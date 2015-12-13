var url;
var f; //video file

window.onload = function() {

  var socket = new SocketManager();
  var vp = new VideoPlayer(document.getElementById('playerarea'));
  loadVideoList(vp);
  registerListeners(socket, vp);
}

function loadVideoList(vp) {
  $.ajax({
    url: "video-list",
    success: function(data) {
    	var videoList = JSON.parse(data);
    	videoList.forEach(function(element) {
    		$("#video_list").append(
					"<li class='VideoName'>" +
            "<a>" +
              "<span class='mif-film icon'></span>" +
              element +
            "</a>" +
          "</li>"
        );
    	});

    	 //search video from server
		  $('.VideoName').click(function() {
		    var videoName = $(this).text();;
		    f = undefined;
		    vp.loadSrc("video/" + videoName, "video/mp4");
		  });
    },
  });
}

function registerListeners(socket, vp) {
  document.getElementById('input_select_video').addEventListener('change', function(event) {
    f = event.target.files[0];
    if(f) {
      console.log(f.name);
      URL.revokeObjectURL(url);
      url = URL.createObjectURL(f);
      vp.loadSrc(url, "video/mp4");
    }
  });

  $('#select_video').click(function(){
    $('#input_select_video').click();
  });

  $('#upload_video').click(function() {
    console.log(f);
    if(f) {
      console.log("try to stream " + f.name);
      socket.emitVideoStream(f);
    }
  });
}
