var config = require('config').get(process.env.NODE_ENV);
var User = require('app/db/model/user');

module.exports = function(server) {
	
    server.get('/user/profile/:uuid', function(req, res, next) {
    	console.log('payload: ' + JSON.stringify(req.payload));
    	var publicmask = {'_id' : 0, 'uuid' : 1, 'name' : 1};
    	var privatemask = {'_id' : 0, '__v' : 0};
    	var mask = publicmask;
    	if(req.params.uuid===req.payload.uuid) {
    		mask = privatemask;
    	}
    	User.findOne({"uuid" : req.params.uuid}, mask).then(function(doc) {
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
			console.log('error looking for user - [' + error + ']');
			res.send(statusCode, message);
		});
        next();
    });
};    

