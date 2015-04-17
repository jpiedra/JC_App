var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongojs = require('mongojs');
var db = mongojs('mongodb://javacrypt_testing:-----@ds062097.mongolab.com:62097/levelsdb', ['leveldata']);
var routes = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
routes(app, path, http, io, fs, db);

http.listen(process.env.PORT || 5000, function(){
	console.log('listening on *:5000');
});
