// reworking to make in to reusable object

"use strict";
console.log('starting');

function Two_Sensor_Solenoid() {
    var self = this;
    self.path = __dirname;
    self.name = 'Two_Sensor_Solenoid'
    self.fs = require('fs');
    self.Gpio = require('onoff').Gpio,
        //self.Gpio = require('./onoff').Gpio, //for using dummy onoff file while testing on cloud9
        self.led = new self.Gpio(26, 'out'), //changed these two values
        self.front_stop = new self.Gpio(13, 'in', 'both'),
        self.end_stop = new self.Gpio(19, 'in', 'both');

    self.state = 0;
    self.count = 0;
    self.running = true;
    //the watch funciton below does not seem to be working in this module
    self.fs.watch(self.path + '/run_state.txt', self.get_run_state);

    self.count = 55;
    /*******paster in seperator********/

    self.notify = function() {} //trying an experiment here to see if I can redifine this in the importing module but still have it call from here.


    //console.log('this',this);
    //console.log('self',self);
    //So it seems the frontstop watches the value of its own pin 
    self.turn_on = function() {
        if (self.state == 0) {
            self.state = 1;
            self.count++;
            self.notify(); // experiment. See funciton comment.
            self.fs.writeFile(self.path + '/count.txt', self.count + '\n', function(err) { if (err) throw err; }); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
            process.stdout.write("Running. Count: " + self.count + "        \r"); // update count in place
            if (self.count % 1000 == 0) //stop at 1000 cycle intervals
                self.shut_off();
            if (self.running)
                self.led.writeSync(self.state); //turn output on
        }
    }

    this.shut_off = function() {
        console.log('shutting down fixture');
        //normally would just write a 0 to run_state.txt but fs.watch doesn't seem to work here
        self.fs.writeFile(self.path + '/run_state.txt', 0 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.get_run_state();
    }

    this.restart = function() {
        self.fs.writeFile(self.path + '/run_state.txt', 1 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.get_run_state();
    }

    this.turn_off = function(led, state) {
        self.state = 0;
        //    console.log('led in turnoff', self.led);
        //    console.log('self in turn off', self);
        //    console.log('this in turn off', this);
        self.led.writeSync(self.state);
    }

    self.front_stop.watch(self.turn_on);
    self.end_stop.watch(self.turn_off);

    /**self.*****paster in seperator********/

    /* Commmenting this function out. Using "this" the unexports don't work as they don't apear to refer to anything.
        Using 'self' the program hangs and won't quit. need to revisit this. 

        process.on('SIGINT', function() {
            this.led.unexport();
            this.front_stop.unexport();
        });
    */
    self.get_run_state = function() {
        console.log('in get runstate');
        self.fs.readFile(self.path + '/run_state.txt', function(err, data) {
            if (err) {
                console.log('no run_state.txt file');
                return 0;
            }
            if (parseInt(data) == 1) {
                self.state = 0;
                self.running = 1;
                self.turn_on();
            }
            else {
                self.running = 0;
                self.led.writeSync(0); //turn output on
            }
        });
    }

}

module.exports = Two_Sensor_Solenoid;
