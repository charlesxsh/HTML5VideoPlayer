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

class VideoPlayerThreeD
{
  /*
    @param numberOfcubeOnx The number of cubes appear on x
    @param numberOfcubeOny The number of cubes appear on y
   */
  constructor(numberOfcubeOnx, numberOfcubeOny)
  {
    if (! Detector.webgl ) Detector.addGetWebGLMessage();
    this.mousePositionX = 0;
    this.mousePositionY = 0;
    this.windowSizeX = window.innerWidth / 2;
    this.windowSizeY = window.innerHeight / 2;
    this.cubeCount = 0;
    this.meshes = [];
    this.materials = [];
    this.numberOfcubeOnx = 20;
    this.numberOfcubeOny = 10;
    this.temp = 1;
  this.counter = 1;
  }

  onWindowResize() 
  {
    this.windowSizeX = window.innerWidth / 2;
    this.windowSizeY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.composer.reset();
  }

  change_uvs( geometry, unitx, unity, offsetx, offsety ) 
  {
    var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
    for ( var i = 0; i < faceVertexUvs.length; i ++ ) 
    {
      var uvs = faceVertexUvs[ i ];
      for ( var j = 0; j < uvs.length; j ++ ) 
      {
        var uv = uvs[ j ];
        uv.x = ( uv.x + offsetx ) * unitx;
        uv.y = ( uv.y + offsety ) * unity;
      }
    }
  }

  onDocumentMouseMove(event) {
    this.mousePositionX = ( event.clientX - this.windowSizeX );
    this.mousePositionY = ( event.clientY - this.windowSizeY ) * 0.3;
  }
  /*
   @param containerNode The div element that holds 3d video player
  */
  init(containerNode)
  {
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 500;
    this.scene = new THREE.Scene();
    //set up light
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0.5, 1, 1 ).normalize();
    this.scene.add( light );
    //set up renderer
    this.renderer = new THREE.WebGLRenderer( { antialias: false } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    containerNode.appendChild( this.renderer.domElement );
    //get video element
    var video = document.getElementsByTagName("video")[0];
    //set up texture
    this.texture = new THREE.VideoTexture( video );
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBFormat;
    var i, j, ux, uy, ox, oy, geometry, xsize, ysize;
    ux = 1 / this.numberOfcubeOnx;
    uy = 1 / this.numberOfcubeOny;
    xsize = 480 / this.numberOfcubeOnx;
    ysize = 204 / this.numberOfcubeOny;
    var parameters = {color: 0xffffff, map: this.texture};

    for ( i = 0; i < this.numberOfcubeOnx; i ++ )
    {
      for ( j = 0; j < this.numberOfcubeOny; j ++ ) 
      {
        ox = i;
        oy = j;
        this.geometry = new THREE.BoxGeometry( xsize, ysize, xsize );
        this.change_uvs( this.geometry, ux, uy, ox, oy );
        this.materials[ this.cubeCount ] = new THREE.MeshLambertMaterial( parameters );
        this.material = this.materials[ this.cubeCount ];
        this.material.hue = i/this.numberOfcubeOnx;
        this.material.saturation = 1 - j/this.numberOfcubeOny;
        this.material.color.setHSL( this.material.hue, this.material.saturation, 0.5 );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.x =   ( i - this.numberOfcubeOnx/2 ) * xsize;
        this.mesh.position.y =   ( j - this.numberOfcubeOny/2 ) * ysize;
        this.mesh.position.z = 0;
        this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 1;
        this.scene.add( this.mesh );
        this.mesh.dx = 0.001 * (0.5 - Math.random());
        this.mesh.dy = 0.001 * (0.5 - Math.random());
        this.meshes[ this.cubeCount ] = this.mesh;
        this.cubeCount += 1;
      }
    }
    this.renderer.autoClear = false;
    document.addEventListener( 'mousemove', this, false );
    // postprocessing
    var renderModel = new THREE.RenderPass( this.scene, this.camera );
    var effectBloom = new THREE.BloomPass( 1.3 );
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
    effectCopy.renderToScreen = true;
    this.composer = new THREE.EffectComposer( this.renderer );
    this.composer.addPass( renderModel );
    this.composer.addPass( effectBloom );
    this.composer.addPass( effectCopy );
    window.addEventListener( 'resize', this, false );
  }


  render() 
  {
    var time = Date.now() * 0.00005;
    this.camera.position.x += ( this.mousePositionX - this.camera.position.x ) * 0.05;
    this.camera.position.y += ( - this.mousePositionY - this.camera.position.y ) * 0.05;
    this.camera.lookAt( this.scene.position );
    for ( i = 0; i < this.cubeCount; i ++ ) 
    {
      this.material = this.materials[ i ];
      this.h = ( 360 * ( this.material.hue + time ) % 360 ) / 360;
      this.material.color.setHSL( this.h, this.material.saturation, 0.5 );
    }

    if ( this.counter % 100 > 50 ) 
    {
      for ( var i = 0; i < this.cubeCount; i ++ ) 
      {
        this.mesh = this.meshes[ i ];
        this.mesh.rotation.x += 10 * this.mesh.dx;
        this.mesh.rotation.y += 10 * this.mesh.dy;
        this.mesh.position.x += 200 * this.mesh.dx;
        this.mesh.position.y += 200 * this.mesh.dy;
        this.mesh.position.z += 400 * this.mesh.dx;
      }
    }

    if ( this.counter % 100 === 0 ) 
    {
      for ( i = 0; i < this.cubeCount; i ++ )
      {
        this.mesh = this.meshes[ i ];
        this.mesh.dx *= -1;
        this.mesh.dy *= -1;
      }
    }
    this.counter ++;
    this.renderer.clear();
    this.composer.render();
  }


}
VideoPlayerThreeD.prototype.handleEvent = function(event) {
  switch(event.type)
  {
    case 'resize':
      this.onWindowResize();
      break;
    case 'mousemove':
      this.onDocumentMouseMove(event);
      break;
  }
};

    // var vd = new VideoPlayerThreeD(20,10);
    // vd.init(document.getElementById('video3d'));

    // function animate()
    // {
    //   window.requestAnimationFrame(animate);
    //   vd.render();
    // }
    // animate();

