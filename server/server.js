var util = require('util'),
	SerialPort = require('serialport').SerialPort,
	xbee_api = require('xbee-api'),
	midi = require('midi')
	output = new midi.output(),
	chalk = require('chalk');

// find the loopbe virtual midi port	
for (var i = 0; i < output.getPortCount(); i++) {
	if (output.getPortName(i).indexOf('LoopBe') > -1) {
		output.openPort(i);
		console.log(chalk.blue('[INFO] Connecté à l\'interface midi ' + output.getPortName(i)));
	}
};

// conf serial port/xbee
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var serialPort = new SerialPort('COM5', {
  parser: xbeeAPI.rawParser()
});

serialPort.on('open', function() {
	console.log(chalk.blue('[INFO] Serveur démarré'));
});

// handle midi notes
var processMessage = function(msg) {
	var furnitureNumber = msg.substring(msg.lastIndexOf('i') + 1, msg.lastIndexOf('i') + 2);

	if (msg.indexOf('connect') > -1) {
		console.log(chalk.blue('[INFO] Meuble ' + furnitureNumber + ' connecté'));
	}
	else if (msg.indexOf('close') > -1) {
		var note = parseInt(furnitureNumber, 10);
		console.log(chalk.green.bold('[NOTE] Meuble ' + furnitureNumber + ' : porte close, note midi:' + note));
		output.sendMessage([176,note,1]);
	}
	else {
		var door = msg.substring(msg.lastIndexOf('#') + 1, msg.length);
		var note = parseInt(furnitureNumber, 10) * 10 + parseInt(door, 10);
		console.log(chalk.green.bold('[NOTE] Meuble ' + furnitureNumber + ' : porte ' + door + ', note midi:' + note));
		output.sendMessage([176,note,1]);
	}
};

// intercept midi notes
xbeeAPI.on('frame_object', function(frame) {
    var msg = '';
    frame.data.forEach(function(chunk) {
    	msg += String.fromCharCode(chunk);
    });
    processMessage(msg);
});
