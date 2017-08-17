// reworking to make in to reusable object
"use strict";

//Not sure I completely understand the syntaax here. Is GPIO a list?
//Does't seem like onoff has ability to configure pullup/pulldown resistors
//2,3,4 seem to be pullup by default, 20 seems to be pulldown by default
//13 and 19 unfortunately seem to be pulldown by default 

console.log('starting');




function Two_Sensor_Solenoid() {
        var self = this;
        this.fs=require('fs');
        this.Gpio = require('onoff').Gpio, 
//    this.Gpio = require('./onoff').Gpio, //for using dummy onoff file while testing on cloud9
        this.led = new this.Gpio(26, 'out'), //changed these two values
        this.front_stop = new this.Gpio(13, 'in', 'both'),
        this.end_stop = new this.Gpio(19, 'in', 'both');
    this.led.writeSync(1);
    console.log(this.led);
    this.state = 0;
    this.count = 0;
    this.running = true;
    this.fs.watch('run_state.txt', this.get_run_state);

    this.count = 55;
    
    this.front_stop.watch(this.turn_on);
    this.end_stop.watch(this.turn_off);
/*******paster in seperator********/

//So it seems the frontstop watches the value of its own pin 
this.turn_on = function() {
    if (this.state == 0) {
        this.state = 1;
        this.count++;
        fs.writeFile('count.txt', count+'\n',function(err){if(err)throw err;}); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
        process.stdout.write("Running. Count: " + this.count + "        \r"); // update count in place
        if (this.count % 1000 == 0) //stop at 1000 cycle intervals
            this.fs.writeFile('run_state.txt', 0 + '\n'); //write a zero to runstate file to stop running.
        if (this.running)
            this.led.writeSync(this.state); //turn output on
    }
}

this.turn_off = function(led, state) {
    state = 0;
    console.log('led in turnoff', led);
    console.log('this in turn off', this);
    console.log('self in turn off', self);
    self.led.writeSync(state);
}

/*******paster in seperator********/
    process.on('SIGINT', function() {
        this.led.unexport();
        this.front_stop.unexport();
    });

}


module.exports = Two_Sensor_Solenoid;
