var restify = require('restify');
var restifyPlugins = require('restify').plugins;
var jwt = require('jsonwebtoken');

var config = require('config').get(process.env.NODE_ENV);

var server = restify.createServer({
	name : config.appname,
	version : config.appversion
});

server.use(restifyPlugins.jsonBodyParser({
	mapParams : true
}));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({
	mapParams : true
}));
server.use(restifyPlugins.fullResponse());

server.use(function(req, res, next) {
	var secure = [ "/profile" ];

	for ( var i in secure) {
		if (req.path().startsWith(secure[i])) {
			var token = req.headers['x-access-token'];
			if (!token) {
				var statusCode = 401;
				var message = {	message : 'No token provided.' };
				res.send(statusCode, message);
				return;
			}

			jwt.verify(token, config.bcrypt_secret, function(err, decoded) {
				if (err) {
					res.send(401, {	message : 'Unauthorized' });
					return;
				}
			});
			break;
		}
	}
	next();
});

var fn_start = function() {
	console.log('starting rest server');
	server.listen(config.rest.port, function() {
		require('./routes/hello')(server);
		require('./routes/register')(server);
		require('./routes/profile')(server);
		require('./routes/login')(server);
		console.log('server %s listening at %s', server.name, server.url);
		console.log('rest server ready');
	});
};

module.exports = {
	start : fn_start
};
