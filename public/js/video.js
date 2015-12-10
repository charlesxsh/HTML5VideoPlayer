"use strict"

function btn_playpause(event)
{
  var video = document.getElementsByTagName("video")[0];
  if(video.paused == true)
  {
    video.play();
    event.target.style.backgroundImage = "url('./src/suspend.png')";
  }
  else
  {
    video.pause();
    event.target.style.backgroundImage = "url('./src/play.png')";
  }
}

function btn_fullscreen(event)
{
    var video = document.getElementsByTagName("video")[0];
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Chrome and Safari
    }
}

function barseek_mousedown(event)
{
  var video = document.getElementsByTagName("video")[0];
  video.pause();
}

function barseek_mouseup(event)
{
  var video = document.getElementsByTagName("video")[0];
  video.play();
}

function barseek_input(event)
{
  var video = document.getElementsByTagName("video")[0];
  video.currentTime = video.duration * (event.target.value / 100);
}

function video_timeupdate(event)
{
  var video = document.getElementsByTagName("video")[0];
  var seekBar = document.getElementById("video-control-panel-barseekbar");
  var value = (100 / video.duration) * video.currentTime;
  seekBar.value = value;
}

class VideoPlayer
{
  /*
   @param videoarea div element that hold html5 video element
   */
  constructor(videoareaElement, useDefault)
  {
    this.videoareaElement = videoareaElement;
    this.videoareaElement.style.backgroundColor = "black";
    this.videoElement = document.createElement("video");
    this.videoElement.style.height = "100%"
    this.videoElement.style.width = "100%"
    this.videoElement.addEventListener("timeupdate", video_timeupdate);

    var videoSource = document.createElement("source");
    videoSource.type = "";
    videoSource.src = "";
    //add videoSouce to videoElement
    this.videoElement.appendChild(videoSource);

    this.videoareaElement.appendChild(this.videoElement);
    useDefault = useDefault || false;
    this.setupControls(useDefault);
  }

  loadSrc(src, type)
  {
    var video = document.getElementsByTagName('video')[0];
    var sources = video.getElementsByTagName('source');
    sources[0].src = src;
    sources[0].type = type;
    video.load();
  }
  /*
    @param useDefault false indicated that use self-define tool bar
                      true indicated that use default controls
   */
  setupControls(useDefault)
  {
    if (useDefault)
    {
      this.videoElement.controls = true;
    }
    else
    {
      var videoControlPanel = document.createElement("div");
      videoControlPanel.id = "video-control-panel"

      var btnPlayPause = document.createElement("button");
      btnPlayPause.id = "video-control-panel-btnplaypause"
      btnPlayPause.type = "button";
      btnPlayPause.addEventListener("click", btn_playpause);

      var barSeek = document.createElement("input");
      barSeek.id = "video-control-panel-barseekbar";
      barSeek.type = "range"
      barSeek.value = 0;
      //barSeek.addEventListener("change", barseek_seek);
      barSeek.addEventListener("mousedown", barseek_mousedown);
      barSeek.addEventListener("mouseup", barseek_mouseup);
      barSeek.addEventListener("input", barseek_input);

      var btnVolumnControl = document.createElement("button");
      btnVolumnControl.id = "video-control-panel-btnvolumncontrol"
      btnVolumnControl.innerHTML = "Vol"

      var btnFullScreen = document.createElement("button");
      btnFullScreen.id = "video-control-panel-btnfullscreen";
      btnFullScreen.innerHTML = "Full"
      btnFullScreen.addEventListener("click", btn_fullscreen);

      //add those buttons and bars to panel
      videoControlPanel.appendChild(barSeek);
      videoControlPanel.appendChild(btnPlayPause);
      videoControlPanel.appendChild(btnVolumnControl);
      videoControlPanel.appendChild(btnFullScreen);
      //add panel to video area
      this.videoareaElement.appendChild(videoControlPanel);
    }
  }
}
