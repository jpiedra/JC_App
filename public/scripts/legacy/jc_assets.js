//jc_assets.js - script will load all images for use
	stoneBlocks_arr = [];
	
	var img = new Image();
	img.ready = false;
	
	var b0 = new Image();
	b0.ready = false;
	var b1 = new Image();
	b1.ready = false;
	var b2 = new Image();
	b2.ready = false;
	var b3 = new Image();
	b3.ready = false;
	var b4 = new Image();
	b4.ready = false;
	var b5 = new Image();
	b5.ready = false;
	var w0 = new Image();
	w0.ready = false;
	
	var char_sprite = new Image();
	char_sprite.ready = false;
	var enemy_sprite = new Image();
	enemy_sprite.ready = false;
	
	var socket=io();
	
//*** STATIC IMAGES FOR CREATING LEVEL ***//
	//background of the canvas element
	socket.on('image-bg', function(info) {
		if (info.image) {
			img.ready = false;
			img.onload = setAssetReady;
			img.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});		
	//tile blocks
	socket.on('res-block-0', function(info) {
		if (info.image) {
			b0.ready = false;
			b0.onload = setAssetReady;
			b0.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});
	socket.on('res-block-1', function(info) {
		if (info.image) {
			b1.ready = false;
			b1.onload = setAssetReady;
			b1.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	socket.on('res-block-2', function(info) {
		if (info.image) {
			b2.ready = false;
			b2.onload = setAssetReady;
			b2.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	socket.on('res-block-3', function(info) {
		if (info.image) {
			b3.ready = false;
			b3.onload = setAssetReady;
			b3.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	socket.on('res-block-4', function(info) {
		if (info.image) {
			b4.ready = false;
			b4.onload = setAssetReady;
			b4.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	socket.on('res-block-5', function(info) {
		if (info.image) {
			b5.ready = false;
			b5.onload = setAssetReady;
			b5.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	//tile wall
	socket.on('res-wall-0', function(info) {
		if (info.image) {
			w0.ready = false;
			w0.onload = setAssetReady;
			w0.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	

	//char sprite
	socket.on('res-mage-spr', function(info) {
		if (info.image) {
			char_sprite.ready = false;
			char_sprite.onload = setAssetReady;
			char_sprite.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});

	//enemy sprite
	socket.on('res-skeletonmage-spr', function(info) {
		if (info.image) {
			enemy_sprite.ready = false;
			enemy_sprite.onload = setAssetReady;
			enemy_sprite.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	

//*** SET IMAGE LOADED TO READY ***//
	function setAssetReady() {
		this.ready = true;
	}

//*** LOAD IMAGES INTO ARRAY ***//
var imgLoader = function (x) {
			var img = new Image();
			img.ready = false;
			img.onload = setAssetReady;
			img.src = x.src;
			return img;
		}
	
//*** DISPLAY LOADING SCREEN ***//
	
	ctx.globalAlpha = 0.7;	
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, w, h);
	ctx.globalAlpha = 1;	
	ctx.fillStyle = "#fff";
	ctx.font = GAME_FONT;
	ctx.fillText("Loading game assets...", 0+12, h-12);
	
	var canRun = false;
	var asset_loader = setInterval(asset_loading, 30);
	
	function asset_loading() {
		
		if (b0.ready && b1.ready && b2.ready && b3.ready && b4.ready && b5.ready && w0.ready && char_sprite.ready) {
			//$("input").css('display', 'inline-block');
			stoneBlocks_arr.push(imgLoader(b0));
			stoneBlocks_arr.push(imgLoader(b1));
			stoneBlocks_arr.push(imgLoader(b3));
			stoneBlocks_arr.push(imgLoader(b4));
			stoneBlocks_arr.push(imgLoader(b5));
			stoneBlocks_arr.push(imgLoader(w0));
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(img, 0, 0);
			clearInterval(asset_loader);
			canRun = true;
		}
	
	}
