/**
 *Exports an object which controls an on / off actuator with two end stop sensors such as an air cylinder
*/

"use strict";
console.log('starting');

function Two_Sensor_Solenoid() {
    var self = this;
    self.path = __dirname;
    self.name = 'Two_Sensor_Solenoid'
    self.state = 0;
    self.count = 0;
    self.running = true;
    var fs = require('fs');
    
    if (fs.existsSync('/sys/class/gpio')) { //Check if gpio are accessible on platform
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

    self.turn_on = function() {
        if (self.state == 0) {
            self.state = 1;
            console.log('in turn on ', self.count );
            self.count++;
            self.update_notify();
            fs.writeFile(self.path + '/count.txt', self.count + '\n', function(err) { if (err) throw err; }); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
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
        fs.writeFile(self.path + '/run_state.txt', 0 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.get_run_state();
    }

    this.restart = function() {
        fs.writeFile(self.path + '/run_state.txt', 1 + '\n', function(err) { if (err) throw err; }); //write a zero to runstate file to stop running.
        self.get_run_state();
    }

    this.turn_off = function(output, state) {
        self.state = 0;
        self.output.writeSync(self.state);
    }


    self.get_run_state = function() {
        console.log('in get runstate');
        fs.readFile(self.path + '/run_state.txt', function(err, data) {
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

/**
 *Following object and associated method contain an object with info to pass along to web browser
 * Probably more clever way of doing this.
*/
    self.forwarded_info ={
        //control
        shut_off:       {},
        //static properties
        name:           { value: self.name, type: 'name'},
        //updatable properties (probably clever way to update in line somehow)
        running :       { value: self.running ,  type : 'toggle'},
        count :         { value: self.count , type : 'setnum' },
        actuator_state: { value: self.state  , type : 'show'}
        
    };
    
    self.update_notify = function(){
        self.forwarded_info.running=self.running;
        self.forwarded_info.count=self.count;
        self.forwarded_info.actuator_state=self.state;
        self.notify(); // experiment. See function comment.
    }
/**
 * Did this as an experiment and it worked first try. Purpose is have a function which can notify in 
 * some other code where this objects is imported of an event in this object. I think what made this difficult
 * as compared to other langueges is the weird asynchrounous patterns in js. Anyway the function is redifined in the
 * code where this object is imported and when it is called here it runs the redefined code. Not sure its the best design pattern
 * may want to look into other options such as eventEmitter, observer etc.
*/
    self.notify = function() {}
    

     
    //the watch funciton below does not seem to be working in this module. May want totry changing fs to var.fs
    fs.watch(self.path + '/run_state.txt', self.get_run_state);
    self.front_stop.watch(self.turn_on);
    self.end_stop.watch(self.turn_off);
//note removed the unexport function since not being used. 
}

module.exports = Two_Sensor_Solenoid;
