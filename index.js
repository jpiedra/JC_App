var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
	io.on('connection', function(socket){
	fs.readFile(__dirname + '/images/logo/logo_new.png', function(err, buf){
		socket.emit('logo', { image: true, buffer: buf.toString('base64') });
		console.log('logo file is initialized');
		});
	});	
});

app.get('/game', function(req, res){
	res.sendFile(__dirname + '/views/game.html');
	io.on('connection', function(socket){
	fs.readFile(__dirname + '/images/texture_floor_a.png', function(err, buf){
		socket.emit('image', { image: true, buffer: buf.toString('base64') });
		console.log('image file is initialized');
		});
	});	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
