//jc_assets.js - script will load all images for use
		
//*** STATIC IMAGES FOR CREATING LEVEL ***//
	var block_img = new Image();
	block_img.ready = false;
	block_img.onload = setAssetReady;
	block_img.src = "images/tile_a_block.png";

	var wall_img = new Image();
	wall_img.ready = false;
	wall_img.onload = setAssetReady;
	wall_img.src = "images/tile_a_wall.png";

	var char_sprite = new Image();
	char_sprite.ready = false;
	char_sprite.onload = setAssetReady;
	char_sprite.src = "images/player/mage/sprite_mage.png";
	
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
