var config = require('config').get(process.env.NODE_ENV);
var User = require('app/db/model/user');
var uuidv4 = require('uuid/v4');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = function(server) {
	server.post('/register', function(req, res, next) {

		if (req.body.email === null || req.body.email === undefined || req.body.password === null || req.body.password === undefined) {
			res.send(400, {	message : 'invalid username/password' });
			next();
			return;
		}

		var payload = {	email : req.body.email };
		var hashedPassword = bcryptjs.hashSync(req.body.password, 8);
		var newToken = jwt.sign(payload, config.bcrypt_secret, { expiresIn : config.jwt.expires });
		var hashedToken = bcryptjs.hashSync(newToken, 8);
		
		var user = new User({
			uuid : uuidv4(),
			token : hashedToken,
			name : req.body.name,
			email : req.body.email,
			password : hashedPassword
		});

		user.save().then(function(user) {
			User.findOne({"email" : user.email}, {'_id' : 0, 'password' : 0, '__v' : 0}).then(function(doc) {
				if(doc===null) {
					var statusCode = 500;
					var message = {message: 'error saving the user'};
					res.send(statusCode, message);
				} else {
					doc.token = newToken;
					res.send(200, doc);
				}
			}).catch(function(error){
				var statusCode = 500;
				var message = {message: 'error looking for user'};
				res.send(statusCode, message);
			});
		}).catch(function(error){
			 var statusCode = 500;
			 var message = { message: 'server error ' + error.code };
			 if(error.code===11000) {
				 statusCode = 409;
				 message = {message: 'email already taken'};
			 }
			 console.log('Error saving user ' + error.code);
			 res.send(statusCode, message);
        });
		next();
	});
};