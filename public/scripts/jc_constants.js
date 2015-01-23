//jc_constants.js - constant values to use across the game's scripts

//THE CANVAS ENVIRONMENT 
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
//TILE DIMENSIONS
	var TILE_W = 48,
		TILE_H = 48;
	
//CHARACTER SIZE AND SPRITE TRAVERSAL
	var CHAR_W = 32,
		CHAR_H = 48;
	
	var CHAR_SPRITE_W = 128,
		CHAR_SPRITE_H = 192,
		SPRITE_START_X = 0,
		SPRITE_START_Y = 144;
		
	
//FRAMES PER SECOND
	var FPS = 33;
	
//OTHER VALUES
	var GAME_FONT = "bold 24pt Lucida Console";