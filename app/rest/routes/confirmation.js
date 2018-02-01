var config = require('config').get(process.env.NODE_ENV);
var User = require('app/db/model/user');
var ConfirmationToken = require('app/db/model/confirmationtoken');
var uuidv4 = require('uuid/v4');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = function(server) {
	server.get('/user/confirmation/:token', function(req, res, next) {

		var mimeToken = req.params.token;
		var token = Buffer.from(mimeToken, 'base64').toString();
		console.log('confirmation token: ' + token);
		ConfirmationToken.findOne({"token" : token}).then(function(confirmationToken){
			if(confirmationToken===null) {
	   		    console.log('confirmation token does not exists');
				res.send(400, {	message : 'confirmation token does not exists' });
				return;
			}
			
			var email = confirmationToken.email;
			User.findOne({"email" : email}).then(function(user) {
				if(user===null) {
					var statusCode = 500;
					var message = {message: 'error validating token'};
		   		    console.log('error validating token [' + error + ']');
					res.send(statusCode, message);
				} else {
					var payload = {	email : email };
					var newToken = jwt.sign(payload, config.bcrypt_secret, { expiresIn : config.jwt.expires });
					user.token = newToken;
					user.confirmed = true;
					user.confirmed_at = Date.now();
					user.updatet_at = Date.now();
					user.save();
					var statusCode = 200;
					var message = {message: 'email confirmation sucessful'};
					confirmationToken.remove();
					res.send(statusCode, message);
				}
			}).catch(function(error){
				var statusCode = 500;
				var message = {message: 'error looking for user'};
	   		    console.log('error looking for user [' + error + ']');
				res.send(statusCode, message);
			});
		}).catch(function(error) {
   		    console.log('invalid confirmation request [' + error + ']');
			res.send(400, {	message : 'invalid confirmation request' });
		});
		next();
	});
};