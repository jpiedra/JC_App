JCGA_V1 = (function() {
	//*** 	Constant Values: 	Keep these embedded directly in the  app object
	//***				as they are to accessed more frequently than other members 
	//THE CANVAS ENVIRONMENT 
	var canvas 			= $("#canvas")[0];
	var ctx 			= canvas.getContext("2d");
	var w 				= $("#canvas").width();
	var h 				= $("#canvas").height();
		
	//TILE DIMENSIONS
	var TILE_W 			= 48;
	var TILE_H 			= 48;
		
	//CHARACTER SIZE AND SPRITE TRAVERSAL
	var CHAR_W 			= 32;
	var CHAR_H 			= 48;
		
	var CHAR_SPRITE_W 		= 128;
	var CHAR_SPRITE_H 		= 192;
	var SPRITE_START_X 		= 0;
	var SPRITE_START_Y 		= 144;
			
		
	//FRAMES PER SECOND
	var FPS 			= 30;
		
	//OTHER VALUES
	var GAME_FONT 			= "bold 24pt Lucida Console";

	//*** 	Static Images: 	used in rendering the game
	var stoneBlocks_arr 		= [];
	
	var bg_img 			= new Image();
	bg_img.ready 			= false;
	bg_img.onload 			= setAssetReady;
	
	var b0 				= new Image();
	b0.ready 			= false;
	b0.onload 			= setAssetReady;
	
	var b1				= new Image();
	b1.ready 			= false;
	b1.onload 			= setAssetReady;
	
	var b2 				= new Image();
	b2.ready 			= false;
	b2.onload 			= setAssetReady;
	
	var b3 				= new Image();
	b3.ready 			= false;
	b3.onload 			= setAssetReady;
		
	var b4 				= new Image();
	b4.ready 			= false;
	b4.onload 			= setAssetReady;
	
	var b5 				= new Image();
	b5.ready 			= false;
	b5.onload 			= setAssetReady;
	
	var w0 				= new Image();
	w0.ready 			= false;
	w0.onload 			= setAssetReady;
	
	var char_sprite 		= new Image();
	char_sprite.ready 		= false;
	char_sprite.onload 		= setAssetReady;
	
	var char_bullet_sprite 		= new Image();
	char_bullet_sprite.ready 	= false;
	char_bullet_sprite.onload 	= setAssetReady;
	
	var enemy_sprite 		= new Image();
	enemy_sprite.ready 		= false;
	enemy_sprite.onload 		= setAssetReady;
	
	//HELPER FUNCTION, SET IMAGE'S STATUS ONCE LOADED
	function setAssetReady() {
		this.ready 	= true;
	};

	//LOAD EACH IMAGE IN THE ARRAY
	var imgLoader 	= function (img_param) {
		var img 	= new Image();
		img.ready 	= false;
		img.onload 	= setAssetReady;
		img.src 	= img_param.src;
		return img;
	};
	
	//RENDER THE CANVAS TO INDICATE THAT ASSETS ARE BEING LOADED
	ctx.globalAlpha 	= 0.7;	
	ctx.fillStyle 		= "#000";
	ctx.fillRect(0, 0, w, h);
	ctx.globalAlpha 	= 1;	
	ctx.fillStyle		= "#fff";
	ctx.font 		= GAME_FONT;
	ctx.fillText("Loading game assets...", 0+12, h-12);
	
	var canRun 		= false;
	var asset_loader	= setInterval(asset_loading, 30);
	
	var asset_loading = function() {
		if (b0.ready && b1.ready && b2.ready && b3.ready && b4.ready && b5.ready && w0.ready && char_sprite.ready && char_bullet_sprite.ready &&
			enemy_sprite.ready) {
			stoneBlocks_arr.push(imgLoader(b0));
			stoneBlocks_arr.push(imgLoader(b1));
			stoneBlocks_arr.push(imgLoader(b3));
			stoneBlocks_arr.push(imgLoader(b4));
			stoneBlocks_arr.push(imgLoader(b5));
			stoneBlocks_arr.push(imgLoader(w0));
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(bg_img, 0, 0);
			clearInterval(asset_loader);
			canRun 	= true;
		};
	};
	
	//*** Parse JSON Level Data: 	functions and members used for level processing
	// 				Begin by parsing a simple schematic text file for a map
	//CONTAINERS FOR LEVEL OBJECTS, TEXTUAL REPRESENTATION AND THEN PROCESSED OBJECTS
	var stringArr 		= [];
	var blockArr 		= [];
	var spaceArr 		= [];
	
	//REFERENCE VARIABLE, AND CONTAINER FOR TEXT INFORMATION OF LEVEL DATA
	var rowArr 		= [];
	var levelData 		= [];
	
	//SENTINELS, MODIFIED ONCE CRUCIAL TASKS ARE COMPLETED TO BROADCAST NEW EVENTS
	var checkWorld 		= false;
	var isWorldBuilt	= false;
	
	//MAZE GRAPH:	copy from this object, this is a template and should not be changed itself.
	var mazeGraph = function() {
		this.nodes = [
						[1,0,1,0,1,0,1,0,1,0,1,0],
						[0,0,0,0,0,0,0,0,0,0,0,0],
						[1,0,1,0,1,0,1,0,1,0,1,0],
						[0,0,0,0,0,0,0,0,0,0,0,0],
						[1,0,1,0,1,0,1,0,1,0,1,0],
						[0,0,0,0,0,0,0,0,0,0,0,0],
						[1,0,1,0,1,0,1,0,1,0,1,0],
						[0,0,0,0,0,0,0,0,0,0,0,0],
						[1,0,1,0,1,0,1,0,1,0,1,0],
						[0,0,0,0,0,0,0,0,0,0,0,0],
						[1,0,1,0,1,0,1,0,1,0,1,0],
						[0,0,0,0,0,0,0,0,0,0,0,0]	
			 ];
	};
					
	var bTMaze_NorthEast = function() {
		var myGraph = new mazeGraph();
		var randomToken;
		
		for (var rCount = 0; rCount < myGraph.nodes.length; rCount++){
			for (var cCount = 0; cCount < myGraph.nodes[0].length; cCount++){
				//if node is on the first row, go east by default
				if (rCount === 0 && cCount < 11) { 
					if (myGraph.nodes[rCount][cCount] != 1) { 
						myGraph.nodes[rCount][cCount] = 2; 
					};
				}
				//else, if node is on the far-east corner, but not the last row that has nodes, go south
				else if (rCount < 11 && cCount === 10) {
					if (myGraph.nodes[rCount][cCount] != 1) { 
						myGraph.nodes[rCount][cCount] = 2; 
					};
				}
				//all other nodes are valid for random north/east branching
				else { 
					if (myGraph.nodes[rCount][cCount] === 1) {
						randomToken = Math.floor((Math.random() * 2) + 1);
						if (randomToken === 1) { myGraph.nodes[rCount - 1][cCount] = 2; }
						else { myGraph.nodes[rCount][cCount + 1] = 2; }
					};
				};
			};		
		};
		
		for (var rCount = 0; rCount < myGraph.nodes.length; rCount++){
			for (var cCount = 0; cCount < myGraph.nodes[0].length; cCount++){
				if (myGraph.nodes[rCount][cCount] != 0) { spaceArr.push( new tilespace(cCount * TILE_W, rCount * TILE_H) );	} 
				else { blockArr.push( new tileblock(cCount * TILE_W, rCount * TILE_H) ); };
			};
		};
		
		for (var nople = 0; nople < 12; nople++) {
			mazerowStr = JSON.stringify(myGraph.nodes[nople])
			console.log (mazerowStr);
		};
		
		isWorldBuilt = true;		
	};
	
	//TILEBLOCK OBJECT: 	a colliding block 
	var tileblock = function(x, y) {
		this.x 	= x;
		this.y 	= y;
		
		this.x2 = x + TILE_W;
		this.y2 = y + TILE_H;
		
		this.width 	= TILE_W;
		this.height 	= TILE_H;
		
		this.imgID 	= Math.floor(Math.random() * 6);
		this.active 	= true;
		
		this.draw = function() {
			if (this.imgID === 0) {
				ctx.drawImage(b0, this.x, this.y, this.width, this.height);
				ctx.drawImage(w0, this.x, this.y+this.height, this.width, this.height);
			};
			if (this.imgID === 1) {
				ctx.drawImage(b1, this.x, this.y, this.width, this.height);
				ctx.drawImage(w0, this.x, this.y+this.height, this.width, this.height);
			};
			if (this.imgID === 2) {
				ctx.drawImage(b2, this.x, this.y, this.width, this.height);
				ctx.drawImage(w0, this.x, this.y+this.height, this.width, this.height);
			};
			if (this.imgID === 3) {
				ctx.drawImage(b3, this.x, this.y, this.width, this.height);
				ctx.drawImage(w0, this.x, this.y+this.height, this.width, this.height);
			};
			if (this.imgID === 4) {
				ctx.drawImage(b4, this.x, this.y, this.width, this.height);
				ctx.drawImage(w0, this.x, this.y+this.height, this.width, this.height);
			};
			if (this.imgID === 5) {
				ctx.drawImage(b5, this.x, this.y, this.width, this.height);
				ctx.drawImage(w0, this.x, this.y+this.height, this.width, this.height);
			};
		};
		
		this.remove = function() {
			this.active = false;
		};
	};
	
	//TILESPACE OBJECT: 	an empty space charaters can walk on
	//						doesn't get rendered, but used for positioning/AI purposes
	var tilespace = function(x, y) {
		this.x 	= x;
		this.y 	= y;
		
		this.width 	= TILE_W;
		this.height = TILE_H;
		
		this.active = true;

		this.remove 	= function() {
			this.active = false;
		};
	};
	
	//COLLISION METHODS: 	used to test if actors are colliding in certain conditions:
	//						in the following order: basic box, x-axis, and y-axis collisions.
	var collides = function(a, b) {
		return a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height > b.y;	
	};
	
	var checkingWorld = function() {
		if (isWorldBuilt) {
			clearInterval(checkWorld);
			beginGame();
		}
	};
		
	window.onload = function() {
		checkWorld = setInterval(checkingWorld, FPS);
	};
	
	var beginGame = function() {
		gameloop 	= setInterval(renderGame, FPS);
		spaceLimit 	= spaceArr.length;
		player_startIndex 	= Math.floor(Math.random()*spaceArr.length);
		enemy_startIndex 	= 0;
		
		playerBullets 	= [];
		enemyBullets 	= [];
		
		gamescore = 0;
		
		function collides(a, b) {
			return a.x < b.x + b.width &&
				a.x + a.width > b.x &&
				a.y < b.y + b.height &&
				a.y + a.height > b.y;	
		};
		
		function collides_x (a, b) {
			if (a.x >= b.x-TILE_W || a.x <= b.x+TILE_W) return true;
			else return false;
		};

		function collides_y (a, b) {
			if (a.y <= b.y+TILE_H || a.y >= b.y-TILE_H) return true;
			else return false;
		};
		
		var player = {
			maxHealth: 100,
			health: 100,
			sprite_w: CHAR_SPRITE_W,
			sprite_h: CHAR_SPRITE_H,
			sprite_x: 0,
			sprite_y: CHAR_SPRITE_H,
			frameCurrent: 0,
			frameLimit: 4,
			x: spaceArr[player_startIndex].x,
			y: spaceArr[player_startIndex].y,
			width: CHAR_W,
			height: CHAR_H,
			lastDir: 'o',
			direction: 'O',
			draw: function() {
				ctx.font="12px Georgia";
				ctx.fillStyle="#002f00";
				ctx.fillText(this.health.toString() + "/" + this.maxHealth.toString(),this.x,this.y-8);
				switch (this.direction) {
					case "N":
						ctx.drawImage(char_sprite, this.sprite_x, 0, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "E":
						ctx.drawImage(char_sprite, this.sprite_x, 48, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "S":
						ctx.drawImage(char_sprite, this.sprite_x, 96, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "W":
						ctx.drawImage(char_sprite, this.sprite_x, 144, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "nS":
						ctx.drawImage(char_sprite, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
						break;
					case "eS":
						ctx.drawImage(char_sprite, 0, 48, this.width, this.height, this.x, this.y, this.width, this.height);
						break;
					case "sS":
						ctx.drawImage(char_sprite, 0, 96, this.width, this.height, this.x, this.y, this.width, this.height);
						break;
					case "wS":
						ctx.drawImage(char_sprite, 0, 144, this.width, this.height, this.x, this.y, this.width, this.height);
						break;
					default:
						ctx.drawImage(char_sprite, 0, 96, this.width, this.height, this.x, this.y, this.width, this.height);
						break;
				};
			},
			
			move: function() {
				prior_x = player.x;
				prior_y = player.y;	
				
				player.draw();
				player.frameCurrent++;
				if (!keydown.left && !keydown.right && !keydown.up && !keydown.down) {
					if (player.lastDir === 'w') {player.direction = "wS"};
					if (player.lastDir === 'e') {player.direction = "eS"};
					if (player.lastDir === 'n') {player.direction = "nS"};
					if (player.lastDir === 's') {player.direction = "sS"};
				}; 
				
				//simple moves: horizontal, vertical
				if (keydown.left) {
					player.lastDir = 'w';
					player.direction = 'W';
					player.x -= 3;
					blockArr.forEach(function(tileblock) {
						if (collides(player, tileblock)) {
							if (collides_y(player, tileblock)) {
								player.x = prior_x;
							};
						};
					})
				};
				  
				if (keydown.right) {
					player.lastDir = 'e';
					player.direction = 'E';
					player.x += 3;
					blockArr.forEach(function(tileblock) {
						if (collides(player, tileblock)) {
							if (collides_y(player, tileblock)) {
								player.x = prior_x;
							};
						};
					})
				};		
							
				if (keydown.up) {
					player.lastDir = 'n';
					player.direction = 'N';
					player.y -= 3;
					blockArr.forEach(function(tileblock) {
						if (collides(player, tileblock)) {
							if (collides_x(player, tileblock)) {
								player.y = prior_y;
							};
						};
					})
				};
				  
				if (keydown.down) {
					player.lastDir = 's';
					player.direction = 'S';
					player.y += 3;
					blockArr.forEach(function(tileblock) {
						if (collides(player, tileblock)) {
							if (collides_x(player, tileblock)) {
								player.y = prior_y;
							};
						};
					})
				};
				
				if (player.x <= 0) { player.x = 0; }
				if (player.x >= w) { player.x = w; }
				if (player.y <= 0) { player.y = 0; }
				if (player.y >= h) { player.y = h; }
				
				if (keydown.space) {
					player.shoot();
					keydown.space = false;
				};
			},
			
			shoot: function() {
				playerBullets.push(playerBullet());
			}
		};
		
		function playerBullet(I) {
			I = I || {};
			I.active = true;
			I.dir = player.direction;
			I.velocity = 10;
			I.width = 8;
			I.height = 8;
			I.x = player.x+11;
			I.y = player.y+24;
			I.color = "#000";
			I.frameCurrent = 0;
			I.frameLimit = 4;
			I.sprite_w = 32;
			I.sprite_x = 0;
			
			I.draw = function() {
				switch (this.dir) {
					case "nS":
					case "N":
						ctx.drawImage(char_bullet_sprite, this.sprite_x, 0, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "eS":
					case "E":
						ctx.drawImage(char_bullet_sprite, this.sprite_x, 8, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "sS":
					case "S":
						ctx.drawImage(char_bullet_sprite, this.sprite_x, 16, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "wS":
					case "W":
						ctx.drawImage(char_bullet_sprite, this.sprite_x, 24, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					default:
						ctx.drawImage(char_bullet_sprite, this.sprite_x, 16, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					};
				
			};
			
			I.update = function() {
				this.frameCurrent++;
				this.draw();
				if (this.dir === "N" ||this.dir === "n" || this.dir === "nS") { 
					this.y -= this.velocity; 
				};
				if (this.dir === "E" || this.dir === "e" || this.dir === "eS") { 
					this.x += this.velocity; 
				};
				if (this.dir === "W" || this.dir === "w" || this.dir === "wS") { 
					this.x -= this.velocity; 
				};
				if (this.dir === "S" || this.dir === "s" || this.dir === "sS" || this.dir === "O") { 
					this.y += this.velocity; 
				};
				//collision against the world
				blockArr.forEach(function(tileblock){
					if (collides(I, tileblock)){
						I.active = false;
					};
				});
				//collision against enemies
				enemies.forEach(function(Enemy){
					if (collides(I, Enemy)){
						Enemy.active = false;
						I.active = false;
						gamescore += 50;
					};
				});
			};
			
			return I;
		};
		
		//var for privacy within IIFE
		var enemies = [];
		
		function Enemy(I) {
			I = I || {};
			I.sprite_w = CHAR_SPRITE_W;
			I.sprite_h = CHAR_SPRITE_H;
			I.sprite_x = 0;
			I.sprite_y = CHAR_SPRITE_H;
			I.frameCurrent = 0;
			I.frameLimit = 4;
			I.x = spaceArr[enemy_startIndex].x;
			I.y = spaceArr[enemy_startIndex].y;
			I.width = CHAR_W;
			I.height = CHAR_H;
			I.direction = 'O';
			I.active = true;
			I.rval = Math.floor((Math.random() * 7) + 1);
			I.moveMarker = 0;
			I.moveLimit = 15;
			I.draw = function() {
				switch (this.direction) {
					case "N":
						ctx.drawImage(enemy_sprite, this.sprite_x, 0, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "E":
						ctx.drawImage(enemy_sprite, this.sprite_x, 48, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "S":
						ctx.drawImage(enemy_sprite, this.sprite_x, 96, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					case "W":
						ctx.drawImage(enemy_sprite, this.sprite_x, 144, this.width, this.height, this.x, this.y, this.width, this.height);
						if (this.frameCurrent > this.frameLimit) {
							this.frameCurrent = 0;
							this.sprite_x += this.width;
							if (this.sprite_x >= this.sprite_w) this.sprite_x = 0; }
							break;
					default:
						ctx.drawImage(enemy_sprite, 0, 96, this.width, this.height, this.x, this.y, this.width, this.height);
						break;
				};
			};
			I.randomMove = function() {
				
				prev_x = I.x;
				prev_y = I.y;	
				
				I.draw();
				I.frameCurrent++;
				I.moveMarker++;
				
				if (I.moveMarker > I.moveLimit) {
				   I.moveMarker = 0;
				   I.rval = Math.floor((Math.random() * 7) + 1);
				};
				
				if (I.rval === 5 || I.rval === 6 || I.rval === 7) {
					I.direction = "O";
				};
				
				//simple moves: horizontal, vertical
				if (I.rval === 2) {
					I.direction = 'W';
					I.x -= 3;
					blockArr.forEach(function(tileblock) {
						if (collides(I, tileblock)) {
							if (collides_y(I, tileblock)) {
								I.x = prev_x;
							};
						};
					})
				};
				  
				if (I.rval === 1) {
					I.direction = 'E';
					I.x += 3;
					blockArr.forEach(function(tileblock) {
						if (collides(I, tileblock)) {
							if (collides_y(I, tileblock)) {
								I.x = prev_x;
							};
						};
					})
				};		
							
				if (I.rval === 4) {
					I.direction = 'N';
					I.y -= 3;
					blockArr.forEach(function(tileblock) {
						if (collides(I, tileblock)) {
							if (collides_x(I, tileblock)) {
								I.y = prev_y;
							};
						};
					})
				};
				  
				if (I.rval === 3) {
					I.direction = 'S';
					I.y += 3;
					blockArr.forEach(function(tileblock) {
						if (collides(I, tileblock)) {
							if (collides_x(I, tileblock)) {
								I.y = prev_y;
							};
						};
					})
				};
				
				if (I.x <= 0) { I.x = 0; }
				if (I.x >= w) { I.x = w; }
				if (I.y <= 0) { I.y = 0; }
				if (I.y >= h) { I.y = h; }
			};
			
			I.update = function() {
				this.randomMove();
			};
			
			return I;
		};
		
		function checkEnemies(){
			if (enemies.length < 3){
				while (enemies.length < 3){
					enemy_startIndex = Math.floor(Math.random()*spaceArr.length);
					enemies.push(Enemy());
				};
			};
		};
		
		function renderGame() {
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(bg_img, 0, 0);
			blockArr.forEach(function(tileblock) {
				tileblock.draw();
			}); 
			checkEnemies();
			enemies.forEach(function(Enemy){
				Enemy.randomMove();
			});
			enemies = enemies.filter(function(Enemy){
				return Enemy.active;
			});
			playerBullets.forEach(function(playerBullet){
				playerBullet.update();
			});
			playerBullets = playerBullets.filter(function(playerBullet){
				return playerBullet.active;
			});
			player.move();
			ctx.fillStyle = "#000";
			ctx.font = GAME_FONT;
			ctx.fillText("Score: " + gamescore.toString(), 16, 32);
		};
		
	};

	return {
		parseNewWorld_JSON : function() {
			var myGraph = new mazeGraph();
			var randomToken;
			
			for (var rCount = 0; rCount < myGraph.nodes.length; rCount++){
				for (var cCount = 0; cCount < myGraph.nodes[0].length; cCount++){
					//if node is on the first row, go east by default
					if (rCount === 0 && cCount < 11) { 
						if (myGraph.nodes[rCount][cCount] != 1) { 
							myGraph.nodes[rCount][cCount] = 2; 
						};
					}
					//else, if node is on the far-east corner, but not the last row that has nodes, go south
					else if (rCount < 11 && cCount === 10) {
						if (myGraph.nodes[rCount][cCount] != 1) { 
							myGraph.nodes[rCount][cCount] = 2; 
						};
					}
					//all other nodes are valid for random north/east branching
					else { 
						if (myGraph.nodes[rCount][cCount] === 1) {
							randomToken = Math.floor((Math.random() * 2) + 1);
							if (randomToken === 1) { myGraph.nodes[rCount - 1][cCount] = 2; }
							else { myGraph.nodes[rCount][cCount + 1] = 2; }
						};
					};
				};		
			};
			
			for (var rCount = 0; rCount < myGraph.nodes.length; rCount++){
				for (var cCount = 0; cCount < myGraph.nodes[0].length; cCount++){
					if (myGraph.nodes[rCount][cCount] != 0) { spaceArr.push( new tilespace(cCount * TILE_W, rCount * TILE_H) );	} 
					else { blockArr.push( new tileblock(cCount * TILE_W, rCount * TILE_H) ); };
				};
			};
			
			for (var nople = 0; nople < 12; nople++) {
				mazerowStr = JSON.stringify(myGraph.nodes[nople])
				console.log (mazerowStr);
			};
			
			isWorldBuilt = true;		
		}
		
		/*parseNewWorld_JSON : function() {
			//select a random index to use to generate a level:
			if(typeof levelPlans === 'undefined') {
				levelPlans = levelPlans_JSON;
			};
			var levelAmt 	= levelPlans.length;
			var levelID 	= Math.floor(Math.random()*levelPlans.length)
			
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
					
			for (var n = 0; n < levelData.length; n++){
				rowArr.push(levelData[n].replace(/\"/g, ""));
			}
			
			for (var m = 0; m < levelData.length; m++){	
				buildRow(rowArr[m], m);
			}
			
			isWorldBuilt = true;
		}*/
	};
	
})();




