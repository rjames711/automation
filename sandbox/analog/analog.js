//reads pin 5 on mcp3008 adc chip
var mcpadc = require('mcp-spi-adc');
var r1=1500;
var r2=3300;
var rt=r1+r2;
var v_div=rt/r2; //represents the voltage division of a 1500 and 3300 resistor
console.log(v_div);

var tempSensor = mcpadc.open(1, {speedHz: 20000}, function (err) {
  if (err) throw err;

  setInterval(function () {
    tempSensor.read(function (err, reading) {
      if (err) throw err;

      console.log('  ' + reading.value *(3.3*v_div));
    });
  }, 1000);
});
