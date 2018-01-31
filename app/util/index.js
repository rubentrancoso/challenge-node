var Promise = require('promise');
var jwt = require('jsonwebtoken');

module.exports = {
	parse : function parse(str) {
		var args = [].slice.call(arguments, 1), i = 0;
		return str.replace(/%s/g, function() {
			return args[i++];
		});
	},
//	bcrypt : function(password) {
//		return new Promise(function(resolve, reject) {
//			bcrypt.genSalt(10, function(err, salt) {
//				if (err) {
//					reject(err);
//				}
//				bcrypt.hash(password, salt, function(err, hash) {
//					resolve(hash);
//				});
//			});
//		});
//	},
	jwttoken : function(payload) {
		// expires in 24 hours
		var result = jwt.sign(payload, 'superSecret', { expiresInMinutes : 1440 });
		return result;
	}
//	,
//	passwordmatches: function(plainPass, hashword ) {
//		return new Promise(function(resolve, reject) {
//			bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
//				if(err) {
//					reject(err);
//				} else {
//					resolve(isPasswordMatch);
//				}
//			});
//		});
//	}
};

