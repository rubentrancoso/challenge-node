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
			res.send(401,{ message : 'Unauthorized(-1)' });
			next();
			return;
		}

		console.log('going to find user - (' + username + ')');
		User.findOne({"email" : username}).then( function(dbuser) {
			if(!dbuser.confirmed) {
				res.send(401,{ message : 'Unauthorized(0) - user not confirmed' });
				next();
				return;
			}
			
			console.log('checking password for user - ' + dbuser);
			if(!bcryptjs.compareSync(password, dbuser.password)) {
				res.send(401,{ message : 'Unauthorized(1)' });
				next();
				return;
			}
			console.log('password matches')
			var payload = {	'uuid' : dbuser.uuid, 'email' : dbuser.email }; 
			var newToken = jwt.sign(payload, config.bcrypt_secret, { expiresIn : config.jwt.expires });
			var hashedToken = bcryptjs.hashSync(newToken, 8);
			dbuser.token = hashedToken;
			console.log('going to save user')
			dbuser.save().then(function(doc) {
				User.findOne({"email" : username}, {'_id' : 0, 'password' : 0, '__v' : 0}).then(function(doc) {
					doc.token = newToken;
					console.log('login sucessful - [' + doc + ']')
					res.send(200, doc);
					next();
					return;
				}).catch(function(error) {
					console.log('Unauthorized(2) - [' + error + ']')
					res.send(401,{ message : 'Unauthorized' });
					next();
					return;
				});
			}).catch(function(error) {
				console.log('Unauthorized(3) - [' + error + ']')
				res.send(401,{ message : 'Unauthorized' });
				next();
				return;
			});
		}).catch(function(error) {
			console.log('Unauthorized(4) - [' + error + ']')
			res.send(401,{ message : 'Unauthorized' });
			next();
			return;
		});
	});
};

