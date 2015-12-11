/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Convolution shader
 * ported from o3d sample to WebGL / GLSL
 * http://o3d.googlecode.com/svn/trunk/samples/convolution.html
 */
THREE.ConvolutionShader = {
	defines: {
		"KERNEL_SIZE_FLOAT": "25.0",
		"KERNEL_SIZE_INT": "25",
	},
	uniforms: {
		"tDiffuse":        { type: "t", value: null },
		"uImageIncrement": { type: "v2", value: new THREE.Vector2( 0.001953125, 0.0 ) },
		"cKernel":         { type: "fv1", value: [] }
	},
	vertexShader: [
		"uniform vec2 uImageIncrement;",
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float cKernel[ KERNEL_SIZE_INT ];",
		"uniform sampler2D tDiffuse;",
		"uniform vec2 uImageIncrement;",
		"varying vec2 vUv;",
		"void main() {",
			"vec2 imageCoord = vUv;",
			"vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );",
			"for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {",
				"sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];",
				"imageCoord += uImageIncrement;",
			"}",
			"gl_FragColor = sum;",
		"}"
	].join( "\n" ),
	buildKernel: function ( sigma ) {
		// We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.
		function gauss( x, sigma ) {
			return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );
		}
		var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;
		if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
		halfWidth = ( kernelSize - 1 ) * 0.5;
		values = new Array( kernelSize );
		sum = 0.0;
		for ( i = 0; i < kernelSize; ++ i ) {
			values[ i ] = gauss( i - halfWidth, sigma );
			sum += values[ i ];
		}
		// normalize the kernel
		for ( i = 0; i < kernelSize; ++ i ) values[ i ] /= sum;
		return values;
	}
};
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */
THREE.CopyShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }
	},
	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float opacity;",
		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",
		"}"
	].join( "\n" )
};
/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.EffectComposer = function ( renderer, renderTarget ) {
	this.renderer = renderer;
	if ( renderTarget === undefined ) {
		var pixelRatio = renderer.getPixelRatio();
		var width  = Math.floor( renderer.context.canvas.width  / pixelRatio ) || 1;
		var height = Math.floor( renderer.context.canvas.height / pixelRatio ) || 1;
		var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
	}
	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();
	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;
	this.passes = [];
	if ( THREE.CopyShader === undefined )
		console.error( "THREE.EffectComposer relies on THREE.CopyShader" );
	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
};
THREE.EffectComposer.prototype = {
	swapBuffers: function() {
		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;
	},
	addPass: function ( pass ) {
		this.passes.push( pass );
	},
	insertPass: function ( pass, index ) {
		this.passes.splice( index, 0, pass );
	},
	render: function ( delta ) {
		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;
		var maskActive = false;
		var pass, i, il = this.passes.length;
		for ( i = 0; i < il; i ++ ) {
			pass = this.passes[ i ];
			if ( ! pass.enabled ) continue;
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );
			if ( pass.needsSwap ) {
				if ( maskActive ) {
					var context = this.renderer.context;
					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );
					context.stencilFunc( context.EQUAL, 1, 0xffffffff );
				}
				this.swapBuffers();
			}
			if ( pass instanceof THREE.MaskPass ) {
				maskActive = true;
			} else if ( pass instanceof THREE.ClearMaskPass ) {
				maskActive = false;
			}
		}
	},
	reset: function ( renderTarget ) {
		if ( renderTarget === undefined ) {
			renderTarget = this.renderTarget1.clone();
			var pixelRatio = this.renderer.getPixelRatio();
			renderTarget.width  = Math.floor( this.renderer.context.canvas.width  / pixelRatio );
			renderTarget.height = Math.floor( this.renderer.context.canvas.height / pixelRatio );
		}
		this.renderTarget1.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2.dispose();
		this.renderTarget2 = renderTarget.clone();
		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;
	},
	setSize: function ( width, height ) {
		this.renderTarget1.setSize( width, height );
		this.renderTarget2.setSize( width, height );
	}
};
/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {
	this.scene = scene;
	this.camera = camera;
	this.overrideMaterial = overrideMaterial;
	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;
	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;
	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;
};
THREE.RenderPass.prototype = {
	render: function ( renderer, writeBuffer, readBuffer, delta ) {
		this.scene.overrideMaterial = this.overrideMaterial;
		if ( this.clearColor ) {
			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();
			renderer.setClearColor( this.clearColor, this.clearAlpha );
		}
		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		if ( this.clearColor ) {
			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );
		}
		this.scene.overrideMaterial = null;
	}
};
/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.MaskPass = function ( scene, camera ) {
	this.scene = scene;
	this.camera = camera;
	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;
	this.inverse = false;
};
THREE.MaskPass.prototype = {
	render: function ( renderer, writeBuffer, readBuffer, delta ) {
		var context = renderer.context;
		// don't update color or depth
		context.colorMask( false, false, false, false );
		context.depthMask( false );
		// set up stencil
		var writeValue, clearValue;
		if ( this.inverse ) {
			writeValue = 0;
			clearValue = 1;
		} else {
			writeValue = 1;
			clearValue = 0;
		}
		context.enable( context.STENCIL_TEST );
		context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
		context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
		context.clearStencil( clearValue );
		// draw into the stencil buffer
		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );
		// re-enable update of color and depth
		context.colorMask( true, true, true, true );
		context.depthMask( true );
		// only render where stencil is set to 1
		context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
		context.stencilOp( context.KEEP, context.KEEP, context.KEEP );
	}
};
THREE.ClearMaskPass = function () {
	this.enabled = true;
};
THREE.ClearMaskPass.prototype = {
	render: function ( renderer, writeBuffer, readBuffer, delta ) {
		var context = renderer.context;
		context.disable( context.STENCIL_TEST );
	}
};
/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.BloomPass = function ( strength, kernelSize, sigma, resolution ) {
	strength = ( strength !== undefined ) ? strength : 1;
	kernelSize = ( kernelSize !== undefined ) ? kernelSize : 25;
	sigma = ( sigma !== undefined ) ? sigma : 4.0;
	resolution = ( resolution !== undefined ) ? resolution : 256;
	// render targets
	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
	this.renderTargetX = new THREE.WebGLRenderTarget( resolution, resolution, pars );
	this.renderTargetY = new THREE.WebGLRenderTarget( resolution, resolution, pars );
	// copy material
	if ( THREE.CopyShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.CopyShader" );
	var copyShader = THREE.CopyShader;
	this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );
	this.copyUniforms[ "opacity" ].value = strength;
	this.materialCopy = new THREE.ShaderMaterial( {
		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		transparent: true
	} );
	// convolution material
	if ( THREE.ConvolutionShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.ConvolutionShader" );
	var convolutionShader = THREE.ConvolutionShader;
	this.convolutionUniforms = THREE.UniformsUtils.clone( convolutionShader.uniforms );
	this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurX;
	this.convolutionUniforms[ "cKernel" ].value = THREE.ConvolutionShader.buildKernel( sigma );
	this.materialConvolution = new THREE.ShaderMaterial( {
		uniforms: this.convolutionUniforms,
		vertexShader:  convolutionShader.vertexShader,
		fragmentShader: convolutionShader.fragmentShader,
		defines: {
			"KERNEL_SIZE_FLOAT": kernelSize.toFixed( 1 ),
			"KERNEL_SIZE_INT": kernelSize.toFixed( 0 )
		}
	} );
	this.enabled = true;
	this.needsSwap = false;
	this.clear = false;
	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();
	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );
};
THREE.BloomPass.prototype = {
	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {
		if ( maskActive ) renderer.context.disable( renderer.context.STENCIL_TEST );
		// Render quad with blured scene into texture (convolution pass 1)
		this.quad.material = this.materialConvolution;
		this.convolutionUniforms[ "tDiffuse" ].value = readBuffer;
		this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurX;
		renderer.render( this.scene, this.camera, this.renderTargetX, true );
		// Render quad with blured scene into texture (convolution pass 2)
		this.convolutionUniforms[ "tDiffuse" ].value = this.renderTargetX;
		this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurY;
		renderer.render( this.scene, this.camera, this.renderTargetY, true );
		// Render original scene with superimposed blur to texture
		this.quad.material = this.materialCopy;
		this.copyUniforms[ "tDiffuse" ].value = this.renderTargetY;
		if ( maskActive ) renderer.context.enable( renderer.context.STENCIL_TEST );
		renderer.render( this.scene, this.camera, readBuffer, this.clear );
	}
};
THREE.BloomPass.blurX = new THREE.Vector2( 0.001953125, 0.0 );
THREE.BloomPass.blurY = new THREE.Vector2( 0.0, 0.001953125 );
/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.ShaderPass = function ( shader, textureID ) {
	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";
	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	this.material = new THREE.ShaderMaterial( {
		defines: shader.defines || {},
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	} );
	this.renderToScreen = false;
	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;
	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();
	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );
};
THREE.ShaderPass.prototype = {
	render: function ( renderer, writeBuffer, readBuffer, delta ) {
		if ( this.uniforms[ this.textureID ] ) {
			this.uniforms[ this.textureID ].value = readBuffer;
		}
		this.quad.material = this.material;
		if ( this.renderToScreen ) {
			renderer.render( this.scene, this.camera );
		} else {
			renderer.render( this.scene, this.camera, writeBuffer, this.clear );
		}
	}
};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */
var Detector = {
	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () {
		try {
			var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
		} catch ( e ) {
			return false;
		}
	} )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,
	getWebGLErrorMessage: function () {
		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';
		if ( ! this.webgl ) {
			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );
		}
		return element;
	},
	addGetWebGLMessage: function ( parameters ) {
		var parent, id, element;
		parameters = parameters || {};
		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';
		element = Detector.getWebGLErrorMessage();
		element.id = id;
		parent.appendChild( element );
	}
};
// browserify support
if ( typeof module === 'object' ) {
	module.exports = Detector;
}