require('app-module-path/register');

var db = require('app/db');
var server = require('app/rest');

db.init()
	.then(function(result){
		db.clean();
	})
	.then(function(result){
		server.start();
	})
	.catch(console.error);
