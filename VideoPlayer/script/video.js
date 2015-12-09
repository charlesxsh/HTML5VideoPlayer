"use strict"
class VideoPlayer
{

  /*
   @param videoarea div element that hold html5 video element
   */
  constructor(videoareaElement)
  {
    this.videoareaElement = videoareaElement
  }

  /*
   @param src video source path
   @param type video type, such as "video/mp4"
   */
  setup(src, type)
  {
    var videoElement = document.createElement("video")
    videoElement.controls = true
    
    var videoSource = document.createElement("source")
    videoSource.type = type
    videoSource.src = src

    //add videoSouce to videoElement
    videoElement.appendChild(videoSource)
    this.videoareaElement.appendChild(videoElement)
  }

}
