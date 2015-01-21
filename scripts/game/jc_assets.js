//jc_assets.js - script will load all images for use
	var socket=io();	
	
//*** STATIC IMAGES FOR CREATING LEVEL ***//
	//background of the canvas element
	socket.on('image-bg', function(info) {
		if (info.image) {
			var img = new Image();
			img.src = 'data:image/jpeg;base64,' + info.buffer;
			ctx.drawImage(img, 0, 0);
		}
	});		
	//tile block
	socket.on('res-block-a', function(info) {
		if (info.image) {
			var block_img = new Image();
			block_img.ready = false;
			block_img.onload = setAssetReady;
			block_img.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	//tile wall
	socket.on('res-wall-a', function(info) {
		if (info.image) {
			var wall_img = new Image();
			wall_img.ready = false;
			wall_img.onload = setAssetReady;
			wall_img.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	

	//char sprite
	socket.on('res-mage-spr', function(info) {
		if (info.image) {
			var char_sprite = new Image();
			char_sprite.ready = false;
			char_sprite.onload = setAssetReady;
			char_sprite.src = 'data:image/jpeg;base64,' + info.buffer;
		}
	});	
	
//*** SET IMAGE LOADED TO READY ***//
	function setAssetReady() {
		this.ready = true;
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
		
		if (block_img.ready && wall_img.ready && char_sprite.ready) {
			ctx.clearRect(0, 0, w, h);
			clearInterval(asset_loader);
			canRun = true;
		}
	
	}
