var config = require('config').get(process.env.NODE_ENV);
var User = require('app/db/model/user');
var uuidv4 = require('uuid/v4');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

function isEmpty(str) {
    return (!str || 0 === str.length);
}

module.exports = function(server) {
	server.post('/login', function(req, res, next) {

		var username = req.body.username;
		var password = req.body.password;
		
		if(isEmpty(username) || isEmpty(password)) {
			res.send(401,{ message : 'Unauthorized' });
			next();
			return;
		}

		var user = null;

		User.findOne({"email" : username}).then(function(doc) {
			user = doc;
			if(!bcryptjs.compareSync(password, user.password)) {
				res.send(401,{ message : 'Unauthorized' });
				next();
				return;
			}
			var payload = {	email : username };
			var newToken = jwt.sign(payload, config.bcrypt_secret, { expiresIn : config.jwt.expires });
			var hashedToken = bcryptjs.hashSync(newToken, 8);
			user.token = hashedToken;
			user.save().then(function(doc) {
				User.findOne({"email" : username}, {'_id' : 0, 'password' : 0, '__v' : 0}).then(function(doc) {
					doc.token = newToken;
					res.send(200, doc);
					next();
					return;
				}).catch(function(error) {
					res.send(401,{ message : 'Unauthorized' });
					next();
					return;
				});
			}).catch(function(error) {
				res.send(401,{ message : 'Unauthorized' });
				next();
				return;
			});
		}).catch(function(error) {
			res.send(401,{ message : 'Unauthorized' });
			next();
			return;
		});
	});
};

