function beginGame() {
	
	alert("begin making characters");
	var gameloop = setInterval(draw, FPS);
	
	var player = {
		sprite_w: CHAR_SPRITE_W,
		sprite_h: CHAR_SPRITE_H,
		sprite_x: 0,
		sprite_y: CHAR_SPRITE_H,
		frameCurrent: 0,
		frameLimit: 4,
		x: spaceArr[0].x,
		y: spaceArr[0].y,
		width: CHAR_W,
		height: CHAR_H,
		direction: 'O',
		draw: function() {
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
				player.direction = "O";
			} 
			
			//simple moves: horizontal, vertical
			if (keydown.left) {
				player.direction = 'W';
				player.x -= 3;
			}
			  
			if (keydown.right) {
				player.direction = 'E';
				player.x += 3;
			}		
						
			if (keydown.up) {
				player.direction = 'N';
				player.y -= 3;
			}
			  
			if (keydown.down) {
				player.direction = 'S';
				player.y += 3;
			}
			
			blockArr.forEach(function(tileblock) {
							
				if (collides(player, tileblock)){
					
					// these two statements work independently, but not together...
					//if (player.y <= tileblock.y+TILE_H) player.y += 3;
					//if (player.y >= tileblock.y-TILE_H) player.y -= 3; 
										
					//else if (player.y <= tileblock.y+TILE_H) player.y += 3;
					//if (player.x <= tileblock.x2) player.x = tileblock.x - TILE_W;		
					
					//really noob collision detection for now
					player.x = prior_x;
					player.y = prior_y;
					
					
				}
							
			})  
		}
	}
	
	function draw() {
		ctx.clearRect(0, 0, w, h);
				
		blockArr.forEach(function(tileblock) {
			tileblock.draw();
		}); 
		
		player.move();
	}
	
};




