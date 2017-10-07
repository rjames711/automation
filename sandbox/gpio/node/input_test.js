console.log('input test')
   var pigpio = require('pigpio');
   var Gpio = pigpio.Gpio;
   var sensor = new Gpio(19, {
       mode: Gpio.INPUT,
       pullUpDown: Gpio.PUD_DOWN,
       edge: Gpio.RISING_EDGE,
   });
   
   var count=0;
   
   sensor.on('interrupt', function(level) {
	console.log('caught it ',count++);
}
);
