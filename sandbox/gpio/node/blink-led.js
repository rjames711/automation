"use strict";

var Gpio = require('onoff').Gpio,
  led = new Gpio(20, 'out'),
  iv;

iv = setInterval(function () {
  led.writeSync(led.readSync() ^ 1);
}, 500);

setTimeout(function () {
  clearInterval(iv);

  led.writeSync(0);
  led.unexport();

  console.log('ok - ' + __filename);
}, 10000);

