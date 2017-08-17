// reworking to make in to reusable object
"use strict";

//Not sure I completely understand the syntaax here. Is GPIO a list?
//Does't seem like onoff has ability to configure pullup/pulldown resistors
//2,3,4 seem to be pullup by default, 20 seems to be pulldown by default
//13 and 19 unfortunately seem to be pulldown by default 

console.log('starting');




function Two_Sensor_Solenoid() {
        var self = this;
        self.fs=require('fs');
    //    self.Gpio = require('onoff').Gpio, 
        self.Gpio = require('./onoff').Gpio, //for using dummy onoff file while testing on cloud9
        self.led = new self.Gpio(26, 'out'), //changed these two values
        self.front_stop = new self.Gpio(13, 'in', 'both'),
        self.end_stop = new self.Gpio(19, 'in', 'both');
    self.led.writeSync(1);
    self.state = 0;
    self.count = 0;
    self.running = true;
    self.fs.watch('run_state.txt', self.get_run_state);

    self.count = 55;
    
    self.front_stop.watch(self.turn_on);
    self.end_stop.watch(self.turn_off);
/*******paster in seperator********/

//So it seems the frontstop watches the value of its own pin 
self.turn_on = function() {
    if (self.state == 0) {
        self.state = 1;
        self.count++;
        fs.writeFile('count.txt', count+'\n',function(err){if(err)throw err;}); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
        process.stdout.write("Running. Count: " + self.count + "        \r"); // update count in place
        if (self.count % 1000 == 0) //stop at 1000 cycle intervals
            self.fs.writeFile('run_state.txt', 0 + '\n'); //write a zero to runstate file to stop running.
        if (self.running)
            self.led.writeSync(self.state); //turn output on
    }
}

self.turn_off = function(led, state) {
    state = 0;
    /* debugging log
    console.log('led in turnoff', led);
    console.log('self in turn off', self);
    console.log('self in turn off', self);
    */
    self.led.writeSync(state);
}

/*******paster in seperator********/

/* Commmenting this function out. Using "this" the unexports don't work as they don't apear to refer to anything.
    Using 'self' the program hangs and won't quit. need to revisit this. 

    process.on('SIGINT', function() {
        this.led.unexport();
        this.front_stop.unexport();
    });
*/


}


module.exports = Two_Sensor_Solenoid;
