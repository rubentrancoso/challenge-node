var config = require('config').get(process.env.NODE_ENV);
var User = require('app/db/model/user');
var jwt = require('jsonwebtoken');

module.exports = function(server) {
    server.get('/profile/:uuid', function(req, res, next) {
    	
    	var token = req.headers['x-access-token'];
    	if (!token) {
			var statusCode = 401;
			var message = {message: 'No token provided.'};
			res.send(statusCode, message);
			next();
    		return;
    	} 
    	
    	jwt.verify(token, config.bcrypt_secret, function(err, decoded) {
    	    if (err) {
    			res.send(401,{ message : 'Unauthorized' });
    			return;
    	    }

    	    User.findOne({"uuid" : req.params.uuid}, {'_id' : 0, 'token' : 0, 'password' : 0, '__v' : 0}).then(function(doc) {
    			if(doc===null) {
    				var statusCode = 404;
    				var message = {message: 'resource not found'};
    				res.send(statusCode, message);
    			} else {
    				res.send(200, doc);
    			}
    		}).catch(function(error){
    			var statusCode = 500;
    			var message = {message: 'error looking for user'};
    			res.send(statusCode, message);
    		});

    	});
        next();
    });
};    

