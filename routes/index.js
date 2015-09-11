module.exports = exports = function(app, path, http, io, fs){
	
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname, '../views', 'index.html'));
		io.on('connection', function(socket){
		fs.readFile(path.join(__dirname, '../images/menu_bg_dark.png'), function(err, buf){
			if (err) throw err;
			socket.emit('menu', { image: true, buffer: buf.toString('base64') });
			console.log('menu background file is initialized');
			});
		fs.readFile(path.join(__dirname, '../images/logo/logo_new.png'), function(err, buf){
			if (err) throw err;
			socket.emit('logo', { image: true, buffer: buf.toString('base64') });
			console.log('logo file is initialized');
			});
		});	
	});

	app.get('/game', function(req, res){
		res.sendFile(path.join(__dirname, '../views', 'game.html'));
		io.on('connection', function(socket){
		//background: gets applied to canvas element
		fs.readFile(path.join(__dirname, '../images/texture_floor_a.png'), function(err, buf){
			if (err) throw err;
			socket.emit('image-bg', { image: true, buffer: buf.toString('base64') });
			console.log('Background image file is initialized');
			});
		//image resources: get used in the actual game
		//tile block
		fs.readFile(path.join(__dirname, '../images/tile/stone_0.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-block-0', { image: true, buffer: buf.toString('base64') });
			console.log('Block stone_0 file is initialized');
			});
		fs.readFile(path.join(__dirname, '../images/tile/stone_1.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-block-1', { image: true, buffer: buf.toString('base64') });
			console.log('Block stone_1 file is initialized');
			});
		fs.readFile(path.join(__dirname, '../images/tile/stone_2.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-block-2', { image: true, buffer: buf.toString('base64') });
			console.log('Block stone_2 file is initialized');
			});
		fs.readFile(path.join(__dirname, '../images/tile/stone_3.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-block-3', { image: true, buffer: buf.toString('base64') });
			console.log('Block stone_3 file is initialized');
			});
		fs.readFile(path.join(__dirname, '../images/tile/stone_4.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-block-4', { image: true, buffer: buf.toString('base64') });
			console.log('Block stone_4 file is initialized');
			});
		fs.readFile(path.join(__dirname, '../images/tile/stone_5.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-block-5', { image: true, buffer: buf.toString('base64') });
			console.log('Block stone_5 file is initialized');
			});
		//tile wall
		fs.readFile(path.join(__dirname, '../images/tile/stone_0_wall.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-wall-0', { image: true, buffer: buf.toString('base64') });
			console.log('Wall stone_0 file is initialized');
			});
		//mage sprite
		fs.readFile(path.join(__dirname, '../images/player/mage/sprite_mage.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-mage-spr', { image: true, buffer: buf.toString('base64') });
			console.log('Mage sprite file is initialized');
			});
		//mage shot sprite
		fs.readFile(path.join(__dirname, '../images/player/mage/sprite_mage_bullet.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-mage-bullet-spr', { image: true, buffer: buf.toString('base64') });
			console.log('Mage bullet sprite file is initialized');
			});
		//skeleton mage sprite
		fs.readFile(path.join(__dirname, '../images/player/skeletonmage/sprite_skeletonmage.png'), function(err, buf){
			if (err) throw err;
			socket.emit('res-skeletonmage-spr', { image: true, buffer: buf.toString('base64') });
			console.log('Skeleton Mage sprite file is initialized');
			});
		});
		
	});

	/*
	app.get('/myLevels', function(req, res){
		if (db) {
			db.leveldata.find(function (err, docs) {
				res.json(docs);
			});
		};
	});

	app.post('/myLevels', function(req, res){
		console.log(req.body);
		db.leveldata.insert(req.body, function(err, doc) {
			res.json(doc);
		});
	});
	*/

	app.get('/upload', function(req, res){
		res.sendFile(path.join(__dirname, '../views', '404.html'));		
		//res.sendFile(path.join(__dirname, '../views', 'upload.html'));
	});
		

	app.get('/about', function(req, res){
		res.sendFile(path.join(__dirname, '../views', 'about.html'));
	});
								
	app.get('*', function(req, res){
		res.sendFile(path.join(__dirname, '../views', '404.html'));
	});
}
