var util = require('util'),
	SerialPort = require('serialport').SerialPort,
	xbee_api = require('xbee-api'),
	chalk = require('chalk');

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var serialPort = new SerialPort('/dev/ttyUSB3', {
  parser: xbeeAPI.rawParser()
});

serialPort.on('open', function() {
	console.log(chalk.blue('[INFO] Serveur connecté'));
});

var processMessage = function(msg) {
	var furnitureNumber = msg.substr(msg.lastIndexOf('i') + 1, msg.lastIndexOf('i') + 2);

	if (msg.indexOf('connect') > -1) {
		console.log(chalk.blue('[INFO] Meuble ' + furnitureNumber + ' connecté'));
	}
	else if (msg.indexOf('close') > -1) {
		var note = parseInt(furnitureNumber, 10);
		console.log(chalk.green.bold('[NOTE] Meuble ' + furnitureNumber + ' : porte close, note midi:' + note));
	}
	else {
		var door = msg.substr(msg.lastIndexOf('#') + 1, msg.length);
		var note = parseInt(furnitureNumber, 10) * 10 + parseInt(door, 10);
		console.log(chalk.green.bold('[NOTE] Meuble ' + furnitureNumber + ' : porte ' + door + ', note midi:' + note));
	}
};

xbeeAPI.on('frame_object', function(frame) {
    var msg = '';
    frame.data.forEach(function(chunk) {
    	msg += String.fromCharCode(chunk);
    });
    processMessage(msg);
});
