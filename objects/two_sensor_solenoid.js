/**
 *Exports an object which controls an on / off actuator with two end stop sensors such as an air cylinder
*/

"use strict";
console.log('starting');

function Two_Sensor_Solenoid() {
    var self = this;
    self.path = __dirname;
    self.name = 'Two_Sensor_Solenoid'
    self.fs = require('fs');
    if (self.fs.existsSync('/sys/class/gpio')) { //Check if gpio are accessible on platform
        console.log('using real onoff module')
        var gpio_module = 'onoff';
    }
    else{
        console.log('using fake onoff module')
        var gpio_module = './onoff';
    }
    self.Gpio = require(gpio_module).Gpio,
        self.output = new self.Gpio(26, 'out'), //changed these two values
        self.front_stop = new self.Gpio(13, 'in', 'both'),
        self.end_stop = new self.Gpio(19, 'in', 'both');

    self.state = 0;
    self.count = 0;
    self.running = true;
    //the watch funciton below does not seem to be working in this module
    self.fs.watch(self.path + '/run_state.txt', self.get_run_state);

/**
 * Did this as an experiment and it worked first try. Purpose is have a function which can notify in 
 * some other code where this objects is imported of an event in this object. I think what made this difficult
 * as compared to other langueges is the weird asynchrounous patterns in js. Anyway the function is redifined in the
 * code where this object is imported and when it is called here it runs the redefined code. Not sure its the best design pattern
 * may want to look into other options such as eventEmitter, observer etc.
*/
    self.notify = function() {}


    self.turn_on = function() {
        if (self.state == 0) {
            self.state = 1;
            self.count++;
            self.notify(); // experiment. See function comment.
            self.fs.writeFile(self.path + '/count.txt', self.count + '\n', function(err) { if (err) throw err; }); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
            process.stdout.write("Running. Count: " + self.count + "        \r"); // update count in place
            if (self.count % 1000 == 0) //stop at 1000 cycle intervals
                self.shut_off();
            if (self.running)
                self.output.writeSync(self.state); //turn output on
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

    this.turn_off = function(output, state) {
        self.state = 0;
        self.output.writeSync(self.state);
    }

    self.front_stop.watch(self.turn_on);
    self.end_stop.watch(self.turn_off);

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
                self.output.writeSync(0); //turn output on
            }
        });
    }

    /* Commmenting this function out. Using "this" the unexports don't work as they don't apear to refer to anything.
        Using 'self' the program hangs and won't quit. need to revisit this. 

        process.on('SIGINT', function() {
            this.output.unexport();
            this.front_stop.unexport();
        });
    */
}

module.exports = Two_Sensor_Solenoid;
