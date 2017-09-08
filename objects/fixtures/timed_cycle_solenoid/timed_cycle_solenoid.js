/**
 *Initializes and exports an object which controls an on / off actuator with two end stop sensors such as an air cylinder
 */

"use strict";
console.log('starting');

function Timed_Cycle_Solenoid() {
    var self = this;

    /**
     * Begin Public Variables
     */
    self.name = 'Two_Sensor_Solenoid'
    self.state = false;
    self.count = 0;
    self.running = true;
    self.path = __dirname;

    self.outercommand = { 'SHUT OFF': "itsa button", 'change count': 'itsa number input' };

    self.shut_off = function() {
        self.state=0;
        solenoid.switch(0);
        console.log('shutting down fixture');
        fs.writeFile(self.path + '/run_state.txt', 0 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.notify();
    }

    self.restart = function() {
        fs.writeFile(self.path + '/run_state.txt', 1 + '\n', function(err) { if (err) throw err; }); //write a one to runstate file to stop running.
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

    var toggle = function() {
        if (self.running) {
            process.stdout.write("Running. Count: " + self.count + "        \r"); // update count in place
            self.state = !self.state;
            solenoid.switch(Number(self.state));
            if (self.state){
                self.count++;
                self.notify();
                
            }
        }
    }


    var get_run_state = function() {
        fs.readFile(self.path + '/run_state.txt', function(err, data) {
            if (err) {
                console.log('no run_state.txt file');
                return 0;
            }
            if (parseInt(data) == 1) {
                self.state = false;
                self.running = true;
                toggle();
                self.notify();
            }
            else {
                self.running = false;
                solenoid.switch(0); //turn output on
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

    const binary_pin = require('../../components/binary_pin.js');
    var solenoid = new binary_pin(26, 'out');






    //the watch funciton below does not seem to be working in this module. May want totry changing fs to var.fs
    fs.watch(self.path + '/run_state.txt', get_run_state);
    setInterval(toggle,1000);

}

module.exports = Timed_Cycle_Solenoid;

var test= new Timed_Cycle_Solenoid();
