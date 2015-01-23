// JC_WORLD.JS: Create the world in which the game happens, basically generate a level //
var prior_x, prior_y;

// Begin by parsing a simple schematic text file for a map
var stringArr = [];
var blockArr = [];
var spaceArr = [];
var checkWorld;
var isWorldBuilt;

// tileblock - defines an square section of wall, characters cannot walk on
function tileblock(x, y) {
	this.x = x;
	this.y = y;
	
	this.x2 = x + TILE_W;
	this.y2 = y + TILE_H;
	
	this.width = TILE_W;
	this.height = TILE_H;
	
	this.active = true;
	
	this.draw = function() {
		ctx.drawImage(block_img, this.x, this.y, this.width, this.height);
		ctx.drawImage(wall_img, this.x, this.y+this.height, this.width, this.height);
	}
	
	ctx.drawImage(block_img, this.x, this.y, this.width, this.height);
	ctx.drawImage(wall_img, this.x, this.y+this.height, this.width, this.height);
	
	this.remove = function() {
		this.active = false;
	}
};

// tilespace - defines an empty space on the map, characters CAN walk on
function tilespace(x, y) {
	this.x = x;
	this.y = y;
	
	this.width = TILE_W;
	this.height = TILE_H;
	
	this.active = true;
	
	/*ctx.globalAlpha = .5;
	ctx.fillStyle = "#ff5050";
	ctx.fillRect( this.x, this.y, this.width, this.height);
	ctx.globalAlpha = 1;*/
	
	this.remove = function() {
		this.active = false;
	}
};

function collides(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;	
};

function collides_x(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x;
};

function collides_y(a, b) {
	return a.y < b.y + b.height &&
		a.y + a.height > b.y;	
};

var parseToWorld = function(rowString, rowNum) {
		var tiles = rowString.split();
		for (tile = 0; tile < rowString.length; tile++){
			if (rowString.charAt(tile) == "*"){
				//blockArr[tile].draw();
				//ctx.drawImage(block_img, tile * TILE_W, rowNum * TILE_H, TILE_W, TILE_H);
				//ctx.drawImage(wall_img, tile * TILE_W, (rowNum * TILE_H) + TILE_H, TILE_W, TILE_H);
				blockArr.push( new tileblock(tile * TILE_W, rowNum * TILE_H) );
				console.log("BLOCK - x: " + tile * TILE_W + " y: " + rowNum * TILE_H);
			} else if (rowString.charAt(tile) == " ") {
				//register the valid space somehow
				spaceArr.push( new tilespace(tile * TILE_W, rowNum * TILE_H) );
				console.log("SPACE - x: " + tile * TILE_W + " y: " + rowNum * TILE_H);
			}
		}
	};

function checkingWorld() {
	if (isWorldBuilt) {
		clearInterval(checkWorld);
		alert("We're done!");
		beginGame();
	}
};
	
window.onload = function() {
	checkWorld = setInterval(checkingWorld, FPS);

	var fileInput = document.getElementById('fileInput');
	var fileOutput = document.getElementById('fileOutput');
	
	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;
		
		if (file.type.match(textType)) {
			var reader = new FileReader();
			
			reader.onload = function(e) {
				//fileOutput.innerText = reader.result;
				
				var lines = this.result.split('\n');
				for(var line = 0; line < lines.length; line++){
					stringArr.push(lines[line]);
					//alert(typeof stringArr[line]);
					//multiply by index in function
					parseToWorld(stringArr[line], line);
				}
				isWorldBuilt = true;
				
			}
			
			reader.readAsText(file);
		} else {
			alert("File reading failed!");
		}
	});
};

