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

function btnvolumnvontrol_mouseenter(event)
{
  var volbar = document.getElementById("video-control-panel-barvol");
  volbar.style.width = "15%";
  volbar.style.visibility = "visible";
}

function btnvolumnvontrol_click(event)
{
  var video = document.getElementsByTagName("video")[0];
  if (video.muted)
  {
      video.muted = false
  }
  else
  {
      video.muted = true;
  }
}

function barvol_mouseleave(event)
{
  var volbar = document.getElementById("video-control-panel-barvol");
  volbar.style.width = "0";
  volbar.style.visibility = "hidden";

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
      //whole control panel
      videoControlPanel.id = "video-control-panel"
      //play&pause button
      btnPlayPause.id = "video-control-panel-btnplaypause"
      btnPlayPause.type = "button";
      //to seek video time bar
      barSeek.id = "video-control-panel-barseekbar";
      barSeek.type = "range"
      barSeek.value = 0;
      //volume control bar
      barVol.id = "video-control-panel-barvol";
      barVol.type = "range";
      barVol.min = "0";
      barVol.max = "1";
      barVol.step = "0.1";
      barVol.value = "1";
      //mute button
      btnVolumnControl.id = "video-control-panel-btnvolumncontrol"
      btnVolumnControl.innerHTML = "Vol"
      //fullscreen button
      btnFullScreen.id = "video-control-panel-btnfullscreen";
      btnFullScreen.innerHTML = "Full"
      //add event listener
      btnPlayPause.addEventListener("click", btn_playpause);
      barSeek.addEventListener("mousedown", barseek_mousedown);
      barSeek.addEventListener("mouseup", barseek_mouseup);
      barSeek.addEventListener("input", barseek_input);
      btnFullScreen.addEventListener("click", btn_fullscreen);
      btnVolumnControl.addEventListener("mouseenter", btnvolumnvontrol_mouseenter);
      btnVolumnControl.addEventListener("click", btnvolumnvontrol_click);
      barVol.addEventListener("mouseleave", barvol_mouseleave);
      //add those buttons and bars to panel
      videoControlPanel.appendChild(barSeek);
      videoControlPanel.appendChild(btnPlayPause);
      videoControlPanel.appendChild(btnVolumnControl);
      videoControlPanel.appendChild(barVol);
      videoControlPanel.appendChild(btnFullScreen);
      //add panel to video area
      this.videoareaElement.appendChild(videoControlPanel);
    }
  }
}
