//from examples in onoff repo
//This one actually works
"use strict";

//Not sure I completely understand the syntaax here. Is GPIO a list?
//Does't seem like onoff has ability to configure pullup/pulldown resistors
//2,3,4 seem to be pullup by default, 20 seems to be pulldown by default

console.log('im a new running signal');
var Gpio = require('onoff').Gpio,
    led = new Gpio(2, 'out'), //changed these two values
    front_stop = new Gpio(3, 'in', 'both'),
    end_stop = new Gpio(4, 'in', 'both');


led.writeSync(1);
var state=0;
var count=0;

//function switch_solenoid(

//So it seems the frontstop watches the value of its own pin 
function turn_on(){
    if (state==0)
    {
        state=1;
        led.writeSync(state);
        count++;
        console.log(count);
    }
}

front_stop.watch(turn_on);

end_stop.watch(function (err, value) {
  if (err) {
    throw err;
  }
    state=0;
    led.writeSync(state);
});


process.on('SIGINT', function () {
  led.unexport();
  front_stop.unexport();
});

