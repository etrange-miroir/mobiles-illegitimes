var net = require('net'),
	chalk = require('chalk'),
	server = net.createServer();

var PORT = 6969,
	HOST = '192.168.0.6';

server.listen(PORT, HOST);
console.log(chalk.blue('[INFO] Server listening on ' + HOST +':'+ PORT));

server.on('connection', function(sock) {
	var num = sock.remoteAddress.substr(sock.remoteAddress.lastIndexOf('.')+1, sock.remoteAddress.length);
	console.log(chalk.blue('[INFO] Meuble ' + num + ' connecté'));
	sock.on('data', function(data) {
		var num = sock.remoteAddress.substr(sock.remoteAddress.lastIndexOf('.')+1, sock.remoteAddress.length);
		data = '' + data;
		var door = data.substr(data.lastIndexOf('#')+1, data.length);
		var note;
		if (door === 'close') {
			note = parseInt(num, 10);
		}
		else {
			note = parseInt(num, 10) * 10 + parseInt(door, 10);
		}
		console.log(chalk.green.bold('[NOTE] Meuble ' + num + ' : porte ' + door + ', note midi:' + note));
	});
	sock.on('close', function(data) {
		console.log(chalk.red.bold('[DECONNEXION] ' + data));
	});
});
