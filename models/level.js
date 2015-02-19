var mongoose = require('mongoose');

var levelSchema = new mongoose.Schema(	{	rA: String,	rB: String,	rC: String,	rD: String,	rE: String,	rF: String,
											rG: String,	rH: String,	rI: String,	rJ: String,	rK: String,	rL: String}, 
										{ collection: 'leveldata' });

module.exports = mongoose.model('level', levelSchema);