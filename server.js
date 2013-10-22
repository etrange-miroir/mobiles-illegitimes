var net = require('net'),
	server = net.createServer();

var PORT = 6969,
	HOST = '192.168.0.1';

server.listen(PORT, HOST);
console.log('[Info] Server listening on ' + HOST +':'+ PORT);

server.on('connection', function(sock) {
	console.log('[Info] Client ' + sock.remoteAddress + ' connected');
	sock.on('data', function(data) {
		console.log('[Data] ' + sock.remoteAddress + ': ' + data);
	});
	sock.on('close', function(data) {
		console.log('[Closed] ' + sock.remoteAddress +' '+ sock.remotePort);
	});
});