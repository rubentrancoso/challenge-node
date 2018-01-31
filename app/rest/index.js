var restify = require('restify');
var restifyPlugins = require('restify').plugins;

var config = require('config').get(process.env.NODE_ENV);

var server = restify.createServer({
	name : 'Hello World!',
	version : '1.0.0'
});

server.use(restifyPlugins.jsonBodyParser({
	mapParams : true
}));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({
	mapParams : true
}));
server.use(restifyPlugins.fullResponse());

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
