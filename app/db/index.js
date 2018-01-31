var config = require('config').get(process.env.NODE_ENV);
var mongoose = require('mongoose');
var Promise = require('promise');

var fn_connect = function() {
	return new Promise(function(resolve, reject) {
		mongoose.connect('mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database);
		var mongodb = mongoose.connection;
		mongodb.on('error', console.error.bind(console, 'connection error:'));
		mongodb.once('open', function() {
			console.log('database connected');
			resolve(mongodb);
		});
	});
};

var fn_clean = function() {
	return new Promise(function(resolve, reject) {
		console.log('clean');
		resolve(1);
	});
};

var fn_init = function() {
	console.log('database initialization');
	return fn_connect()
	.then(function(result) {
		console.log('intialization done.');
	}).catch(console.error);
};

module.exports = {
		init : fn_init,
		connect : fn_connect,
		clean : fn_clean
	};
