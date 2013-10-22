var wpi = require('wiring-pi'),
	Door = require('./door'),
	os = require('os'),
	net = require('net');

var PORT = 6969,
	HOST = '192.168.0.1';

var client = new net.Socket();
client.connect(PORT, HOST, function() {
    console.log('Connected to: ' + HOST + ':' + PORT);
});

var hostname = os.hostname();

wpi.setup('wpi');

var doors = [0,1,2,3,4,5,6,7,10,11];

doors.forEach(function(id) {
	var door = new Door(id);
	door.on('fall', function(value) {
		var msg = hostname + '#' + this.id;
		console.log(msg);
		client.write(msg)
	});
});


