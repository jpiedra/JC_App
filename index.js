var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var url = require('url');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
	io.on('connection', function(socket){
	fs.readFile(__dirname + '/images/menu_bg_dark.png', function(err, buf){
		socket.emit('menu', { image: true, buffer: buf.toString('base64') });
		console.log('menu background file is initialized');
		});
	fs.readFile(__dirname + '/images/logo/logo_new.png', function(err, buf){
		socket.emit('logo', { image: true, buffer: buf.toString('base64') });
		console.log('logo file is initialized');
		});
	});	
});

app.get('/game', function(req, res){
	res.sendFile(__dirname + '/views/game.html');
//	res.sendFile(__dirname + '/scripts/game/jc_constants.js');
//	res.sendFile(__dirname + '/scripts/game/jc_assets.js');
	io.on('connection', function(socket){
	//i will fix this later, i *promise*
	//background: gets applied to canvas element
	fs.readFile(__dirname + '/images/texture_floor_a.png', function(err, buf){
		socket.emit('image-bg', { image: true, buffer: buf.toString('base64') });
		console.log('Background image file is initialized');
		});
	//image resources: get used in the actual game
	//tile block
	fs.readFile(__dirname + '/images/tile_a_block.png', function(err, buf){
		socket.emit('res-block-a', { image: true, buffer: buf.toString('base64') });
		console.log('Tile A block file is initialized');
		});
	//tile wall
	fs.readFile(__dirname + '/images/tile_a_wall.png', function(err, buf){
		socket.emit('res-wall-a', { image: true, buffer: buf.toString('base64') });
		console.log('Tile A wall file is initialized');
		});
	//mage sprite
	fs.readFile(__dirname + '/images/player/mage/sprite_mage.png', function(err, buf){
		socket.emit('res-mage-spr', { image: true, buffer: buf.toString('base64') });
		console.log('Mage sprite file is initialized');
		});
	});	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
