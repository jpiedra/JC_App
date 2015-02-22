function beginGame() {
	var gameloop = setInterval(draw, FPS);
	var spaceLimit = spaceArr.length;
	var player_startIndex = Math.floor(Math.random()*spaceArr.length);
	var enemy_startIndex;
	
	var playerBullets = [];
	var enemyBullets = [];
	
	function collides_x (a, b) {
		if (a.x >= b.x-TILE_W || a.x <= b.x+TILE_W) return true;
		else return false;
	}


	function collides_y (a, b) {
		if (a.y <= b.y+TILE_H || a.y >= b.y-TILE_H) return true;
		else return false;
	}
	
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
			}
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
			} 
			
			//simple moves: horizontal, vertical
			if (keydown.left) {
				player.lastDir = 'w';
				player.direction = 'W';
				player.x -= 3;
				blockArr.forEach(function(tileblock) {
					if (collides(player, tileblock)) {
						if (collides_y(player, tileblock)) {
							player.x = prior_x;
						}
					}
				})
			}
			  
			if (keydown.right) {
				player.lastDir = 'e';
				player.direction = 'E';
				player.x += 3;
				blockArr.forEach(function(tileblock) {
					if (collides(player, tileblock)) {
						if (collides_y(player, tileblock)) {
							player.x = prior_x;
						}
					}
				})
			}		
						
			if (keydown.up) {
				player.lastDir = 'n';
				player.direction = 'N';
				player.y -= 3;
				blockArr.forEach(function(tileblock) {
					if (collides(player, tileblock)) {
						if (collides_x(player, tileblock)) {
							player.y = prior_y;
						}
					}
				})
			}
			  
			if (keydown.down) {
				player.lastDir = 's';
				player.direction = 'S';
				player.y += 3;
				blockArr.forEach(function(tileblock) {
					if (collides(player, tileblock)) {
						if (collides_x(player, tileblock)) {
							player.y = prior_y;
						}
					}
				})
			}
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
			}
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
				}
			
			if (I.rval === 5 || I.rval === 6 || I.rval === 7) {
				I.direction = "O";
			} 
			
			//simple moves: horizontal, vertical
			if (I.rval === 2) {
				I.direction = 'W';
				I.x -= 3;
				blockArr.forEach(function(tileblock) {
					if (collides(I, tileblock)) {
						if (collides_y(I, tileblock)) {
							I.x = prev_x;
						}
					}
				})
			}
			  
			if (I.rval === 1) {
				I.direction = 'E';
				I.x += 3;
				blockArr.forEach(function(tileblock) {
					if (collides(I, tileblock)) {
						if (collides_y(I, tileblock)) {
							I.x = prev_x;
						}
					}
				})
			}		
						
			if (I.rval === 4) {
				I.direction = 'N';
				I.y -= 3;
				blockArr.forEach(function(tileblock) {
					if (collides(I, tileblock)) {
						if (collides_x(I, tileblock)) {
							I.y = prev_y;
						}
					}
				})
			}
			  
			if (I.rval === 3) {
				I.direction = 'S';
				I.y += 3;
				blockArr.forEach(function(tileblock) {
					if (collides(I, tileblock)) {
						if (collides_x(I, tileblock)) {
							I.y = prev_y;
						}
					}
				})
			}
		};
		I.update = function() {
			this.randomMove();
		};
		return I;
	}
	
	function checkEnemies(){
		if (enemies.length < 3){
			while (enemies.length < 3){
				enemy_startIndex = Math.floor(Math.random()*spaceArr.length);
				enemies.push(Enemy());
			}
		}
	};
	
	function draw() {
		ctx.clearRect(0, 0, w, h);
		ctx.drawImage(img, 0, 0);		
		blockArr.forEach(function(tileblock) {
			tileblock.draw();
		}); 
		checkEnemies();
		enemies.forEach(function(Enemy){
			Enemy.randomMove();
		});
		player.move();
	}
	
};




