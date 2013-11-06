var wpi = require('wiring-pi'),
	Door = require('./door'),
	os = require('os'),
	net = require('net'),
	hostname = os.hostname(),
	PORT = 6969,
	HOST = '192.168.0.6',
	client = new net.Socket(),
	doors = [0,1,2,3,4,5,6,7,10,11],
	lastOpenedDoor;

// required setup
wpi.setup('wpi');

// connecting the client
client.connect(PORT, HOST, function() {
    console.log('[INFO] Connected to: ' + HOST + ':' + PORT);
});

// handle event for each door
doors.forEach(function(id) {
	var door = new Door(id);
	// opening door
	// every opening door raise a message, 
	// so every opening door will run a new sound instead of the playing one
	door.on('fall', function() {
		lastOpenedDoor = this.id;
		var msg = hostname + '#' + this.id;
		console.log('[INFO] Opening door: ' + this.id);
		client.write(msg);
	});
	// closing door
	// if the closing door is the last opened one, 
	// send a message to run the ambient sound
	// other closing doors do nothing
	door.on('rise', function() {
		console.log('Closing door: ' + this.id);
		if (this.id === lastOpenedDoor) {
			var msg = hostname + '#close';
			console.log('[INFO] Last open door closed');
			client.write(msg);
		}
	});
});