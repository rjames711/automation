/**
 *Exports an object which controls an on / off actuator with two end stop sensors such as an air cylinder
 */

"use strict";
console.log('starting');

function Two_Sensor_Solenoid() {
    var self = this;

    /**
     * Begin Public Variables
     */
    self.name = 'Two_Sensor_Solenoid'
    self.state = 0;
    self.count = 0;
    self.running = true;
    self.path = __dirname;

    self.shut_off = function() {
        console.log('shutting down fixture');
        fs.writeFile(self.path + '/run_state.txt', 0 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.notify();
    }

    self.restart = function() {
        fs.writeFile(self.path + '/run_state.txt', 1 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.notify();
    }


    /**
     * Did this as an experiment and it worked first try. Purpose is have a function which can notify in 
     * some other code where this objects is imported of an event in this object. I think what made this difficult
     * as compared to other langueges is the weird asynchrounous patterns in js. Anyway the function is redifined in the
     * code where this object is imported and when it is called here it runs the redefined code. Not sure its the best design pattern
     * may want to look into other options such as eventEmitter, observer etc.
     */
    self.notify = function() {}




    /**
     * Begin Private attributes
     */

    var turn_off = function() {
        self.state = 0;
        output.writeSync(self.state);
        self.notify();
    }


    var get_run_state = function() {
        fs.readFile(self.path + '/run_state.txt', function(err, data) {
            if (err) {
                console.log('no run_state.txt file');
                return 0;
            }
            if (parseInt(data) == 1) {
                self.state = 0;
                self.running = 1;
                turn_on();
                self.notify();
            }
            else {
                self.running = 0;
                output.writeSync(0); //turn output on
                self.notify();
            }
        });
    }

    var fs = require('fs');

    if (fs.existsSync('/sys/class/gpio')) { //Check if gpio are accessible on platform
        console.log('using real onoff module')
        var gpio_module = 'onoff';
    }
    else {
        console.log('using fake onoff module')
        var gpio_module = './onoff';
    }

    var Gpio = require(gpio_module).Gpio,
        output = new Gpio(26, 'out'), //changed these two values
        front_stop = new Gpio(13, 'in', 'both'),
        end_stop = new Gpio(19, 'in', 'both');

    var turn_on = function() {
        if (self.state == 0) {
            self.state = 1;
            self.count++;
            self.notify();
            fs.writeFile(self.path + '/count.txt', self.count + '\n', function(err) { if (err) throw err; }); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
            process.stdout.write("Running. Count: " + self.count + "        \r"); // update count in place
            if (self.count % 1000 == 0) //stop at 1000 cycle intervals
                self.shut_off();
            if (self.running)
                output.writeSync(self.state); //turn output on
        }
        self.notify();
    }




    //the watch funciton below does not seem to be working in this module. May want totry changing fs to var.fs
    fs.watch(self.path + '/run_state.txt', get_run_state);
    front_stop.watch(turn_on);
    end_stop.watch(turn_off);
    //note removed the unexport function since not being used. 
}

module.exports = Two_Sensor_Solenoid;
