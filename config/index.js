var config = {
	default: {
		name: 'default',
		bcrypt_secret: '123456',
		mongodb : {
			host: 'localhost',
			port: 27017,
			database: 'mydatabase'
		},
		rest: {
			host: 'localhost',
			port: 8080
		},
		jwt: {
			expires: 86400
		}
	}
};

exports.get = function get(env) {
	return config[env] || config.default;
};