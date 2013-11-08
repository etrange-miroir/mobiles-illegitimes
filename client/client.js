var os = require('os'),
	hostname = os.hostname(),
	wpi = require('wiring-pi'),
	SerialPort = require('serialport').SerialPort,
	xbee_api = require('xbee-api'),	
	C = xbee_api.constants,
	Door = require('./door'),
	doors = [0,1,2,3,4,5,6,7,10,11],
	lastOpenedDoor;

// required setup
wpi.setup('wpi');

// enable xbee api mode 2
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

// serial port for xbee
var serialPort = new SerialPort('/dev/ttyUSB0', {
	parser: xbeeAPI.rawParser()
});

// common stuff for each sent frame
var frame = {
	type: C.FRAME_TYPE.TX_REQUEST_16,
	destination16: '0005'
};

// when open, start listening for door events
serialPort.on('open', function() {

	// notify the server
	var msg = hostname + '#connect';
	frame.data = msg;
	serialPort.write(xbeeAPI.buildFrame(frame));

	// handle event for each door
	doors.forEach(function(id) {
		var door = new Door(id);
		// opening door
		// every opening door raise a message, 
		// so every opening door will run a new sound instead of the playing one
		door.on('fall', function() {
			lastOpenedDoor = this.id;
			var msg = hostname + '#' + this.id;
			frame.data = msg;
			console.log('[INFO] Opening door: ' + this.id);
			serialPort.write(xbeeAPI.buildFrame(frame));
		});
		// closing door
		// if the closing door is the last opened one, 
		// send a message to run the ambient sound
		// other closing doors do nothing
		door.on('rise', function() {
			console.log('[INFO] Closing door: ' + this.id);
			if (this.id === lastOpenedDoor) {
				var msg = hostname  + '#close';
				frame.data = msg;
				console.log('[INFO] Last open door closed');
				serialPort.write(xbeeAPI.buildFrame(frame));
			}
		});
	});
});
