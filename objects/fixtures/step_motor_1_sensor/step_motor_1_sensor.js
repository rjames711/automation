const step_object = require('../components/step_motor.js')
var stepper1 = new step_object(17, 27, 15.3*200);
var pigpio = require('pigpio');
var Gpio = pigpio.Gpio;
var homed_in = false;
var new_home_pass = true;
var move1 = [180, 700, 250 ];
var move2 = [-45, 700, 250 ];

var sensor = new Gpio(19, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE,
});

sensor.on('interrupt', function(level) {
    sensor_action(level);
});

var sensor_action = function() {
       if (homed_in & new_home_pass) {
           new_home_pass = false;
           console.log('Found home at: ', Math.round(current_pos, ' degrees'));
       }
       else if (!homed_in) {
           homed_in = true;
           stepper1.set_position(0);
           stepper1.cycle();
           console.log("homed in position");
       }
}

var cycle = function(){
    stepper1.clear_movements()
    stepper1.add_movement(move1);
    stepper1.add_movement(move2);
}

var recycle = function(){
    stepper1.reset_current_move();
    stepper1.begin_stepping;
}

stepper1.add_movement(180,300,250);
stepper1.begin();
