var JCGA_V1 = (function() {
	//*** 	Constant Values: 	Keep these embedded directly in the  app object
	//***						as they are to accessed more frequently than other members 
	//THE CANVAS ENVIRONMENT 
	canvas 			= $("#canvas")[0];
	ctx 			= canvas.getContext("2d");
	w 				= $("#canvas").width();
	h 				= $("#canvas").height();
		
	//TILE DIMENSIONS
	TILE_W 			= 48;
	TILE_H 			= 48;
		
	//CHARACTER SIZE AND SPRITE TRAVERSAL
	CHAR_W 			= 32;
	CHAR_H 			= 48;
		
	CHAR_SPRITE_W 	= 128;
	CHAR_SPRITE_H 	= 192;
	SPRITE_START_X 	= 0;
	SPRITE_START_Y 	= 144;
			
		
	//FRAMES PER SECOND
	FPS 			= 30;
		
	//OTHER VALUES
	GAME_FONT 		= "bold 24pt Lucida Console";

	//*** 	Static Images: 	used in rendering the game
	stoneBlocks_arr = [];
	
	bg_img 			= new Image();
	bg_img.ready 	= false;
	
	b0 				= new Image();
	b0.ready 		= false;
	
	b1				= new Image();
	b1.ready 		= false;
	
	b2 				= new Image();
	b2.ready 		= false;
	
	b3 				= new Image();
	b3.ready 		= false;
	
	b4 				= new Image();
	b4.ready 		= false;
	
	b5 				= new Image();
	b5.ready 		= false;
	
	w0 				= new Image();
	w0.ready 		= false;
	
	char_sprite 		= new Image();
	char_sprite.ready 	= false;
	enemy_sprite 		= new Image();
	enemy_sprite.ready 	= false;
	
	socket			= io();
	
	//BACKGROUND OF THE GAME
	socket.on('image-bg', function(info) {
		if (info.image) {
			bg_img.ready 	= false;
			bg_img.onload 	= setAssetReady;
			bg_img.src 	= 'data:image/jpeg;base64,' + info.buffer;
		};
	});		
	//TILE BLOCKS
	socket.on('res-block-0', function(info) {
		if (info.image) {
			b0.ready 	= false;
			b0.onload	= setAssetReady;
			b0.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});
	socket.on('res-block-1', function(info) {
		if (info.image) {
			b1.ready 	= false;
			b1.onload 	= setAssetReady;
			b1.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	
	socket.on('res-block-2', function(info) {
		if (info.image) {
			b2.ready 	= false;
			b2.onload 	= setAssetReady;
			b2.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	
	socket.on('res-block-3', function(info) {
		if (info.image) {
			b3.ready 	= false;
			b3.onload 	= setAssetReady;
			b3.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	
	socket.on('res-block-4', function(info) {
		if (info.image) {
			b4.ready 	= false;
			b4.onload 	= setAssetReady;
			b4.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	
	socket.on('res-block-5', function(info) {
		if (info.image) {
			b5.ready 	= false;
			b5.onload 	= setAssetReady;
			b5.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	
	//TILE WALL
	socket.on('res-wall-0', function(info) {
		if (info.image) {
			w0.ready 	= false;
			w0.onload 	= setAssetReady;
			w0.src 		= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	

	//CHARACTER SPRITE
	socket.on('res-mage-spr', function(info) {
		if (info.image) {
			char_sprite.ready 	= false;
			char_sprite.onload 	= setAssetReady;
			char_sprite.src 	= 'data:image/jpeg;base64,' + info.buffer;
		};
	});

	//SKELETON MAGE SPRITE
	socket.on('res-skeletonmage-spr', function(info) {
		if (info.image) {
			enemy_sprite.ready 	= false;
			enemy_sprite.onload = setAssetReady;
			enemy_sprite.src 	= 'data:image/jpeg;base64,' + info.buffer;
		};
	});	

	//HELPER FUNCTION, SET IMAGE'S STATUS ONCE LOADED
	function setAssetReady() {
		this.ready 				= true;
	};

	//LOAD EACH IMAGE IN THE ARRAY
	imgLoader 	= function (img_param) {
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
	ctx.font 			= GAME_FONT;
	ctx.fillText("Loading game assets...", 0+12, h-12);
	
	canRun 				= false;
	asset_loader 		= setInterval(asset_loading, 30);
	
	function asset_loading() {
		if (b0.ready && b1.ready && b2.ready && b3.ready && b4.ready && b5.ready && w0.ready && char_sprite.ready) {
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
	// 								Begin by parsing a simple schematic text file for a map
	//CONTAINERS FOR LEVEL OBJECTS, TEXTUAL REPRESENTATION AND THEN PROCESSED OBJECTS
	stringArr 		= [];
	blockArr 		= [];
	spaceArr 		= [];
	
	//REFERENCE VARIABLE, AND CONTAINER FOR TEXT INFORMATION OF LEVEL DATA
	rowArr 			= [];
	levelData 		= [];
	
	//SENTINELS, MODIFIED ONCE CRUCIAL TASKS ARE COMPLETED TO BROADCAST NEW EVENTS
	checkWorld 		= false;
	isWorldBuilt	= false;
	
	//TILEBLOCK OBJECT: 	a colliding block 
	function tileblock(x, y) {
		this.x 	= x;
		this.y 	= y;
		
		this.x2 = x + TILE_W;
		this.y2 = y + TILE_H;
		
		this.width 	= TILE_W;
		this.height = TILE_H;
		
		this.imgID 	= Math.floor(Math.random() * 6);
		this.active = true;
		
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
	function tilespace(x, y) {
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
	
	parseNewWorld_JSON = function() {
		//select a random index to use to generate a level:
		if(typeof levelPlans === 'undefined') {
			levelPlans = levelPlans_JSON;
		};
		levelAmt 	= levelPlans.length;
		levelID 	= Math.floor(Math.random()*levelPlans.length)
		
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
		
	};

	buildRow = function(rowString, rowNum) {
		j = 0;
		tiles = rowString.split();
		for (j = 0; j < 12; j++){
			if (rowString.charAt(j) === "o" || rowString.charAt(j) === "O"){
				blockArr.push( new tileblock(j * TILE_W, rowNum * TILE_H) );
				console.log("BLOCK - x: " + j * TILE_W + " y: " + rowNum * TILE_H);
			} else if (rowString.charAt(j) === "-"){
				spaceArr.push( new tilespace(j * TILE_W, rowNum * TILE_H) );
				console.log("SPACE - x: " + j * TILE_W + " y: " + rowNum * TILE_H);
			}
		}
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
	
	function beginGame() {
		gameloop 	= setInterval(draw, FPS);
		spaceLimit 	= spaceArr.length;
		player_startIndex 	= Math.floor(Math.random()*spaceArr.length);
		enemy_startIndex 	= 0;
		
		playerBullets 	= [];
		enemyBullets 	= [];
		
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
		
		player = {
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
			},
			
			shoot: function() {
				//make this shoot!
			}
		}
		
		function playerBullet(I, direction) {
			I.active = true;
			I.dir = direction;
			I.velocity = 10;
			I.width = 8;
			I.height = 8;
			I.x = player.x+(player.x/2);
			I.y = player.y+(player.y/2);
			I.color = "#000";
			
			I.draw = function() {
				canvas.fillStyle = this.color;
				canvas.fillRect(this.x, this.y, this.width, this.height);
			};
			
			I.update = function() {
				if (this.dir === "N" ||this.dir === "n" || this.dir === "nS") { 
					this.y -= this.velocity; 
				};
				if (this.dir === "E" || this.dir === "e" || this.dir === "eS") { 
					this.x += this.velocity; 
				};
				if (this.dir === "W" || this.dir === "w" || this.dir === "wS") { 
					this.x -= this.velocity; 
				};
				if (this.dir === "S" || this.dir === "s" || this.dir === "sS") { 
					this.y += this.velocity; 
				};
			};
			
			return I;
		}
		
		enemies = [];
		
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
		
		function draw() {
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(bg_img, 0, 0);		
			blockArr.forEach(function(tileblock) {
				tileblock.draw();
			}); 
			checkEnemies();
			enemies.forEach(function(Enemy){
				Enemy.randomMove();
			});
			player.move();
		};
		
	};

})();




