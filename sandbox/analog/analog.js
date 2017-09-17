//reads pin 5 on mcp3008 adc chip
var mcpadc = require('mcp-spi-adc');

var tempSensor = mcpadc.open(5, {speedHz: 20000}, function (err) {
  if (err) throw err;

  setInterval(function () {
    tempSensor.read(function (err, reading) {
      if (err) throw err;

      console.log(('  ' + reading.value * 3.3 ) );
    });
  }, 1000);
});
