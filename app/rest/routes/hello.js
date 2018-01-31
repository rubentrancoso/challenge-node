var errors = require('restify-errors');
var config = require('config').get(process.env.NODE_ENV);

module.exports = function(server) {
    server.get('/hello', function(req, res, next) {
        res.send(200, 
        	{ 
        		message: 'hello',
        		env: process.env,
        		conf: config
        	} 
        );
        next();
    });
};    