var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var url = require('url');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/levelsDB');

app.use("/public", express.static(__dirname + '/public'));

app.use(function(req, res, next){ 
	req.db = db;
	next();
});

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
	io.on('connection', function(socket){
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

app.get('/upload', function(req, res){
	res.sendFile(__dirname + '/views/upload.html');
});

app.get('*', function(req, res){
	res.sendFile(__dirname + '/views/404.html');
});

http.listen(process.env.PORT || 5000, function(){
	console.log('listening on *:5000');
});
