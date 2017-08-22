function actuator_2_sensor() {
    var self = this;
    self.fs = require('fs');
    self.Gpio = require('onoff').Gpio,
        //self.Gpio = require('./onoff').Gpio, //for using dummy onoff file while testing on cloud9
        self.led = new self.Gpio(26, 'out'), //changed these two values
        self.front_stop = new self.Gpio(13, 'in', 'both'),
        self.end_stop = new self.Gpio(19, 'in', 'both');



}
