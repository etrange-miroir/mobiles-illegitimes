var wpi = require('wiring-pi');
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var doorEvents = {
	change: 'change',
	rise: 'rise',
	fall: 'fall'
};

var Door = function (id) {
	var _self = this;
	_self.id = id;
	wpi.pinMode(_self.id, wpi.modes.INPUT);
	_self.read(function(value) {
		_self.currentValue = value;
		setInterval(function() {
			_self.read(function(value) {
				if (_self.currentValue !== value) {
					_self.currentValue = value;
					_self.emit(doorEvents.change, _self.currentValue);
					if (parseInt(_self.currentValue,10)) {
						_self.emit(doorEvents.rise);
					}
					else {
						_self.emit(doorEvents.fall);
					}
				}
			});
		}, 100);
	});
}
util.inherits(Door, EventEmitter);

Door.prototype.read = function(callback) {
	callback(wpi.digitalRead(this.id));
};

module.exports = Door;