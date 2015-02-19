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

function collides_sc(a, b) {
	if (a.y <= b.y+TILE_H) player.y += 3;
	if (a.y >= b.y-TILE_H) player.y -= 3; 
	if (a.x >= b.x-TILE_W) player.x -= 3;	
	if (a.x <= b.x+TILE_W) player.x += 3;
};

function collides_x(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x;
};

function collides_y(a, b) {
	return a.y < b.y + b.height &&
		a.y + a.height > b.y;	
};

var parseNewWorld_JSON = function() {
	//select a random index to use to generate a level:
	var levelAmt = levelPlans.length;
	var levelID = Math.floor(Math.random()*levelPlans.length)
	
	//populate array of strings from levelPlans random object, row by row
	var levelData = [];
	
	levelData.push(JSON.stringify(levelPlans[levelID].rA));
	levelData.push(JSON.stringify(levelPlans[levelID].rB));
	levelData.push(JSON.stringify(levelPlans[levelID].rC));
	levelData.push(JSON.stringify(levelPlans[levelID].rD));
	levelData.push(JSON.stringify(levelPlans[levelID].rE));
	levelData.push(JSON.stringify(levelPlans[levelID].rF));
	levelData.push(JSON.stringify(levelPlans[levelID].rG));
	levelData.push(JSON.stringify(levelPlans[levelID].rH));
	levelData.push(JSON.stringify(levelPlans[levelID].rI));
	levelData.push(JSON.stringify(levelPlans[levelID].rJ));
	levelData.push(JSON.stringify(levelPlans[levelID].rK));
	levelData.push(JSON.stringify(levelPlans[levelID].rL));
	
	//move each levelData string to rowArr, splitting it
	//also, get rid of those double quotes
	//then, populate a row using each rowArr element
	var rowArr = [];
	
	for (var n = 0; n < levelData.length; n++){
		rowArr.push(levelData[n].replace(/\"/g, ""));
	}
	
	for (var m = 0; m < levelData.length; m++){	
		buildRow(rowArr[m], m);
	}
	
	isWorldBuilt = true;
	
}

var buildRow = function(rowString, rowNum) {
	var j = 0;
	var tiles = rowString.split();
	for (j = 0; j < 12; j++){
		if (rowString.charAt(j) === "o" || rowString.charAt(j) === "O"){
			blockArr.push( new tileblock(j * TILE_W, rowNum * TILE_H) );
			console.log("BLOCK - x: " + j * TILE_W + " y: " + rowNum * TILE_H);
		} else if (rowString.charAt(j) === "-"){
			spaceArr.push( new tilespace(j * TILE_W, rowNum * TILE_H) );
			console.log("SPACE - x: " + j * TILE_W + " y: " + rowNum * TILE_H);
		}
	}
	//console(spaceArr.length);
};

function checkingWorld() {
	if (isWorldBuilt) {
		clearInterval(checkWorld);
		beginGame();
	}
};
	
window.onload = function() {
	checkWorld = setInterval(checkingWorld, FPS);
};

