//from examples in onoff repo
//This one actually works
"use strict";

//Not sure I completely understand the syntaax here. Is GPIO a list?
//Does't seem like onoff has ability to configure pullup/pulldown resistors
//2,3,4 seem to be pullup by default, 20 seems to be pulldown by default
var Gpio = require('onoff').Gpio,
  led = new Gpio(21, 'out'), //changed these two values
  button = new Gpio(4, 'in', 'both');

button.watch(function (err, value) {
  if (err) {
    throw err;
  }
    console.log('change detected');
    led.writeSync(value);
});

process.on('SIGINT', function () {
  led.unexport();
  button.unexport();
});

