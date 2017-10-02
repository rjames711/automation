var pigpio = require('pigpio');
var Gpio = pigpio.Gpio,
  button = new Gpio(19, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE,
  }),
  led = new Gpio(26, {mode: Gpio.OUTPUT});

var state=true;

button.on('interrupt', function (level) {
  state = !state;
  led.digitalWrite(state);
});

process.on('SIGINT', function () {
  led.digitalWrite(0);
  pigpio.terminate(); // pigpio C library terminated here
  console.log('Terminating...');
  process.exit();
});
