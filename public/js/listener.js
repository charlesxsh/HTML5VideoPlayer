function selectLocalVideo(vp, event) {
  var file = event.target.files[0];
  if(file) {
    console.log(file.name);
    URL.revokeObjectURL(url);
    url = URL.createObjectURL(file);
    vp.loadSrc(url, "video/mp4");
    $('section').css({'visibility':'visible'});
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
      $('#upload_video').html(
        "<a>" +
          "<span class='mif-spinner5 mif-ani-spin icon'></span>" +
            " Uploading" +
        "</a>"
      );
      socket.emitVideoStream(file);
    }
}

function queryVideo(event) {
  //get event data
  var socket = event.data.socket;
  var videoPlayer =  event.data.videoPlayer;

  var i = $((event.delegateTarget)).index();
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

  videoPlayer.loadSrc("video/" + videoFileName, "video/mp4");
  isPlayingCloudVideo = true;
  currentVideoFileName = videoFileName;
  $('section').css({'visibility':'visible'});
}

function submitBullet(event) {
  if(
      (event.delegateTarget === $('#bullet_submit input').get(0) && event.which === 13) ||
      (event.delegateTarget === $('#bullet_submit button').get(0))
    ) {
    if(videoPlayer.isLoaded() && isPlayingCloudVideo) {
      var input = $('#bullet_submit input');
      var inputValue = input.val();
      input.val('');
      var bullet = {
        comment: inputValue,
        time: videoPlayer.getCurrentVideoTime(),
        videoFileName: currentVideoFileName
      };
      var socket = event.data;
      socket.emitBullet(bullet);
    } else {
      console.log("no cloud video is loaded");
    }
  }
}

function submitChat(event) {
  if(
      (event.delegateTarget === $('#chat_submit input').get(0) && event.which === 13) ||
      (event.delegateTarget === $('#chat_submit button').get(0))
    ) {
    if(videoPlayer.isLoaded() && isPlayingCloudVideo) {
      var input = $('#chat_submit input');
      var inputValue = input.val();
      input.val('');
      var socket = event.data;
      socket.emitChat(inputValue);
    } else {
      console.log("no cloud video is loaded");
    }
  }
}

function handleChat(socket) {
  socket.onChat(function(msg) {
    $('#messages').append($('<li>').text(msg));
  });
}

function handleBullet(videoPlayer,socket){
  
  //dynamically receive a bullet
  socket.onBullet(function (msg) {
    videoPlayer.dyAddBulletToVideo({"comment":msg.comment,"time":msg.time});
  });

};

function populateVideoTable(element, count) {
  console.log(count);
  var rowCount = -1;
  if(count % 4 === 0) {
    //new row
    rowCount++;
    $('#videos_from_server table tbody ').append(
      "<tr>" +
        "<td>"+
          "<div class='VideoName'>" +         
            "<img src='src/p' width='220px'>" +
            "<h4>"+element.title+"</h4>" +
          "</div>" +
        "</td>" +
      "</tr>"
    );
  } else {
    //same row
    $($('#videos_from_server table tbody tr').get(rowCount)).append(
      "<td>"+
        "<div class='VideoName'>" +         
          "<img src='src/p' width='220px'>" +
          "<h4>"+element.title+"</h4>" +
        "</div>" +
      "</td>"
    );
  }
}
