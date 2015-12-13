"use strict"
var is3d = false;
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
    if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
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

function btnvolumnvontrol_mouseenter(event)
{
  var volbar = document.getElementById("video-control-panel-barvol");
  volbar.style.width = "15%";
  volbar.style.visibility = "visible";
}

function btnvolumnvontrol_click(event)
{
  var video = document.getElementsByTagName("video")[0];
  var volbar = document.getElementById("video-control-panel-barvol");
  if (video.muted)
  {
      video.muted = false;
      volbar.value = "0.5";
      event.target.style.backgroundImage = "url('./src/nomute.png')";
  }
  else
  {
      video.muted = true;
      volbar.value = "0";
      event.target.style.backgroundImage = "url('./src/mute.png')";
  }
}

function barvol_mouseleave(event)
{
  var volbar = document.getElementById("video-control-panel-barvol");
  volbar.style.width = "2.5%";
  volbar.style.visibility = "hidden";
}

function barvol_change(event)
{
  var video = document.getElementsByTagName("video")[0];
  video.volume = event.target.value;
}

function btnthree_click(event)
{
  var container = document.getElementById("threedvideocontainer");
  container.style.display = "block";
  container.style.width = window.innerWidth + "px";
  container.style.height = window.innerHeight + "px";
  is3d = true;
  animate();
  document.getElementById("playerarea").style.display = "none";
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
      var btnPlayPause = document.createElement("button");
      var barSeek = document.createElement("input");
      var barVol = document.createElement("input");
      var btnVolumnControl = document.createElement("button");
      var btnFullScreen = document.createElement("button");
      var btnThreeDMode = document.createElement("button");
      //whole control panel
      videoControlPanel.id = "video-control-panel"
      //play&pause button
      btnPlayPause.id = "video-control-panel-btnplaypause"
      btnPlayPause.type = "button";
      btnPlayPause.className += "control-panel-button";
      //to seek video time bar
      barSeek.id = "video-control-panel-barseekbar";
      barSeek.type = "range"
      barSeek.value = 0;
      barSeek.className += "video-control-panel-bar";
      //volume control bar
      barVol.id = "video-control-panel-barvol";
      barVol.type = "range";
      barVol.min = "0";
      barVol.max = "1";
      barVol.step = "0.1";
      barVol.value = "1";
      barVol.className += "video-control-panel-bar";
      //mute button
      btnVolumnControl.id = "video-control-panel-btnvolumncontrol";
      btnVolumnControl.className += "control-panel-button";
      //fullscreen button
      btnFullScreen.id = "video-control-panel-btnfullscreen";
      btnFullScreen.className += "control-panel-button";
      //3d mode button
      btnThreeDMode.className += "control-panel-button";
      btnThreeDMode.id = "video-control-panel-btnthreedmode";
      btnThreeDMode.innerHTML = "3D"
      //add event listener
      btnPlayPause.addEventListener("click", btn_playpause);
      barSeek.addEventListener("mousedown", barseek_mousedown);
      barSeek.addEventListener("mouseup", barseek_mouseup);
      barSeek.addEventListener("input", barseek_input);
      btnFullScreen.addEventListener("click", btn_fullscreen);
      btnVolumnControl.addEventListener("mouseenter", btnvolumnvontrol_mouseenter);
      btnVolumnControl.addEventListener("click", btnvolumnvontrol_click);
      barVol.addEventListener("mouseleave", barvol_mouseleave);
      barVol.addEventListener("change", barvol_change);
      btnThreeDMode.addEventListener("click", btnthree_click);
      //add those buttons and bars to panel
      videoControlPanel.appendChild(barSeek);
      videoControlPanel.appendChild(btnPlayPause);
      videoControlPanel.appendChild(btnVolumnControl);
      videoControlPanel.appendChild(barVol);
      videoControlPanel.appendChild(btnFullScreen);
      videoControlPanel.appendChild(btnThreeDMode);
      //add panel to video area
      this.videoareaElement.appendChild(videoControlPanel);
    }
  }

  /*
    get the current video time
  */
  getCurrentVideoTime()
  {
    return this.videoElement.currentTime;
  }

  /*
  check a video whether or not is loaded.
  */
  isLoaded()
  {
    if (this.videoElement.readyState === 4)
    {
        return true;
    }
    else
    {
        return false;
    }
  }
}

/*
  detect esc to quit 3d video player mode
  */
window.addEventListener("keyup", function(event){
  if(event.which == "27")
  {
    var container = document.getElementById("threedvideocontainer");
    container.style.display = "none";
    document.getElementById("playerarea").style.display = "block";
    is3d = false;
  }
});
