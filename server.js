var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var url = require('url');
var mongo = require('mongodb');
var mongojs = require('mongojs');
var db = mongojs('levelsDB', ['leveldata']);
/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/levelsDB', function(err) {
	if(err) {
		console.log('mongoose connection error', err);
	} else {
		console.log('mongoose connection successful');
	}
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('mongoose connected to db');
});
var level = require('./models/level.js');*/

app.use("/public", express.static(__dirname + '/public'));

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
	fs.readFile(__dirname + '/images/tile/stone_0.png', function(err, buf){
		socket.emit('res-block-0', { image: true, buffer: buf.toString('base64') });
		console.log('Block stone_0 file is initialized');
		});
	fs.readFile(__dirname + '/images/tile/stone_1.png', function(err, buf){
		socket.emit('res-block-1', { image: true, buffer: buf.toString('base64') });
		console.log('Block stone_1 file is initialized');
		});
	fs.readFile(__dirname + '/images/tile/stone_2.png', function(err, buf){
		socket.emit('res-block-2', { image: true, buffer: buf.toString('base64') });
		console.log('Block stone_2 file is initialized');
		});
	fs.readFile(__dirname + '/images/tile/stone_3.png', function(err, buf){
		socket.emit('res-block-3', { image: true, buffer: buf.toString('base64') });
		console.log('Block stone_3 file is initialized');
		});
	fs.readFile(__dirname + '/images/tile/stone_4.png', function(err, buf){
		socket.emit('res-block-4', { image: true, buffer: buf.toString('base64') });
		console.log('Block stone_4 file is initialized');
		});
	fs.readFile(__dirname + '/images/tile/stone_5.png', function(err, buf){
		socket.emit('res-block-5', { image: true, buffer: buf.toString('base64') });
		console.log('Block stone_5 file is initialized');
		});
	//tile wall
	fs.readFile(__dirname + '/images/tile/stone_0_wall.png', function(err, buf){
		socket.emit('res-wall-0', { image: true, buffer: buf.toString('base64') });
		console.log('Wall stone_0 file is initialized');
		});
	//mage sprite
	fs.readFile(__dirname + '/images/player/mage/sprite_mage.png', function(err, buf){
		socket.emit('res-mage-spr', { image: true, buffer: buf.toString('base64') });
		console.log('Mage sprite file is initialized');
		});
	//skeleton mage sprite
	fs.readFile(__dirname + '/images/player/skeletonmage/sprite_skeletonmage.png', function(err, buf){
		socket.emit('res-skeletonmage-spr', { image: true, buffer: buf.toString('base64') });
		console.log('Skeleton Mage sprite file is initialized');
		});
	});
	
});

app.get('/myLevels', function(req, res){
	/*db.leveldata.findOne(function (err, doc) {
		console.log(doc);
		res.json(doc);
	});*/
	db.leveldata.find(function (err, docs) {
		//console.log(docs);
		res.json(docs);
	});
});

app.get('/upload', function(req, res){
	res.sendFile(__dirname + '/views/upload.html');
});

/*might not need this soon... 
app.get('/levels', function(req, res){
	level.find(function (err, levels) {
		if (err) return next (err);
		res.json(levels);
	});
});
*/
							
app.get('*', function(req, res){
	res.sendFile(__dirname + '/views/404.html');
});

http.listen(process.env.PORT || 5000, function(){
	console.log('listening on *:5000');
});
