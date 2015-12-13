var container = document.getElementById("threedvideocontainer");
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
var scene = new THREE.Scene();
var video = document.getElementsByTagName("video")[0];
var image = document.createElement("canvas");

var stats, renderer;
var imageContext, imageReflection, imageReflectionContext, imageReflectionGradient,
		texture, textureReflection;

var mesh;

var mousePositionX = 0;
var mousePositionY = 0;

var windowWidth = window.innerWidth *(2/3);
var windowHeight = window.innerHeight * (2/3);

init();
animate();

function init()
{
  camera.position.z = 1000;
  image.width = 640;
  image.height = 480;
  imageContext = image.getContext("2d");
  imageContext.fillStyle = '#000000';
  imageContext.fillRect( 0, 0, 480, 204 );
  texture = new THREE.Texture( image );
  var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
  imageReflection = document.createElement( 'canvas' );
	imageReflection.width = 640;
	imageReflection.height = 480;

  imageReflectionContext = imageReflection.getContext( '2d' );
  imageReflectionContext.fillStyle = '#000000';
  imageReflectionContext.fillRect( 0, 0, 480, 204 );

  imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, 204 );
  imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
  imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );

  textureReflection = new THREE.Texture( imageReflection );

	var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, side: THREE.BackSide, overdraw: 0.5 } );

	//

	var plane = new THREE.PlaneGeometry( 480, 204, 4, 4 );

	mesh = new THREE.Mesh( plane, material );
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
	scene.add(mesh);

	mesh = new THREE.Mesh( plane, materialReflection );
	mesh.position.y = -306;
	mesh.rotation.x = - Math.PI;
	mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
	scene.add( mesh );
  var separation = 150;
	var amountx = 10;
	var amounty = 10;

	var PI2 = Math.PI * 2;
	var material = new THREE.SpriteCanvasMaterial( {

		color: 0x0808080,
		program: function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();

		}

	} );

	for ( var ix = 0; ix < amountx; ix++ ) {
		for ( var iy = 0; iy < amounty; iy++ ) {
			particle = new THREE.Sprite( material );
			particle.position.x = ix * separation - ( ( amountx * separation ) / 2 );
			particle.position.y = -153;
			particle.position.z = iy * separation - ( ( amounty * separation ) / 2 );
			particle.scale.x = particle.scale.y = 2;
			scene.add( particle );
		}
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new THREE.Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseMove( event ) {

		mousePositionX = ( event.clientX - windowWidth );
		mousePositionY = ( event.clientY - windowHeight ) * 0.2;

	}

	//

	function animate() {

		requestAnimationFrame( animate );

		render();
		stats.update();

	}

	function render() {

		camera.position.x += ( mousePositionX - camera.position.x ) * 0.05;
		camera.position.y += ( - mousePositionY - camera.position.y ) * 0.05;
		camera.lookAt( scene.position );

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			imageContext.drawImage( video, 0, 0 );

			if ( texture ) texture.needsUpdate = true;
			if ( textureReflection ) textureReflection.needsUpdate = true;

		}

		imageReflectionContext.drawImage( image, 0, 0 );
		imageReflectionContext.fillStyle = imageReflectionGradient;
		imageReflectionContext.fillRect( 0, 0, 480, 204 );

		renderer.render( scene, camera );

	}
