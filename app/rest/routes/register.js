var config = require('config').get(process.env.NODE_ENV);
var User = require('app/db/model/user');
var ConfirmationToken = require('app/db/model/confirmationtoken');
var uuidv4 = require('uuid/v4');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = function(server) {
	server.post('/user/register', function(req, res, next) {

		if (req.body.email === null || req.body.email === undefined || req.body.password === null || req.body.password === undefined) {
			res.send(400, {	message : 'invalid username/password' });
			next();
			return;
		}

		var newUuid = uuidv4();
		var payload = {	'uuid' : newUuid, 'email' : req.body.email };
		var hashedPassword = bcryptjs.hashSync(req.body.password, 8);
		var newConfirmationToken = jwt.sign(payload, config.bcrypt_secret, { expiresIn : config.jwt.expires });
		
		var user = new User({
			uuid : newUuid,
			name : req.body.name,
			email : req.body.email,
			password : hashedPassword,
			confirmed : false
		});
		
		var confirmationToken = new ConfirmationToken({
			token : newConfirmationToken,
			email : req.body.email
		});

		user.save().then(function(user) {
			User.findOne({"email" : user.email}, {'_id' : 0, 'password' : 0, '__v' : 0}).then(function(doc) {
				if(doc===null) {
					var statusCode = 500;
					var message = {message: 'error saving the user'};
					res.send(statusCode, message);
				} else {
					ConfirmationToken.remove({email:confirmationToken.email}).then(function(result){
						confirmationToken.save().then(function(doc){
							var message = { message : 'user registration sucessful' };
							doc.token = Buffer.from(doc.token).toString('base64');
				   		    console.log('user registration sucessful [' + doc + ']');
				   		    console.log('confirmation token is [' + doc.token + ']');
							res.send(200, message);
						}).catch(function(error){
							var statusCode = 500;
							var message = {message: 'error saving confirmation token'};
				   		    console.log('error saving confirmation token [' + error + ']');
				   		    res.send(statusCode, message);
						});
					}).catch(function(error) {
						var statusCode = 500;
						var message = {message: 'error removing previous confirmation token'};
			   		    console.log('error removing previous confirmation token [' + error + ']');
						res.send(statusCode, message);
					})
				}
			}).catch(function(error){
				var statusCode = 500;
				var message = {message: 'error looking for user'};
	   		    console.log('error looking for user [' + error + ']');
				res.send(statusCode, message);
			});
		}).catch(function(error){
			 var statusCode = 500;
			 var message = { message: 'server error ' + error.code };
			 if(error.code===11000) {
				 statusCode = 409;
				 message = {message: 'email already taken'};
			 }
			 console.log('error saving user (' + message.message + ') [' + error + ']');
			 res.send(statusCode, message);
        });
		next();
	});
};