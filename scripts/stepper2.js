const step_object = require('../objects/components/step_motor.js')
var stepper1 = new step_object(17, 27, 200);

stepper1.add_degrees_movement(180, 1000, 250);
stepper1.add_degrees_movement(90, 1000, 250);
stepper1.add_degrees_movement(-180, 1000, 250);
stepper1.add_degrees_movement(360, 1000, 250);
stepper1.add_degrees_movement(-360, 1000, 250);
stepper1.add_degrees_movement(0, 1000, 250);
stepper1.add_degrees_movement(45, 1000, 250);
stepper1.add_degrees_movement(90, 1000, 250);
stepper1.add_degrees_movement(135, 1000, 250);
stepper1.add_degrees_movement(180, 1000, 250);
stepper1.add_degrees_movement(225, 1000, 250);
stepper1.add_degrees_movement(270, 1000, 250);
stepper1.add_degrees_movement(0, 1000, 250);
var on_complete = function(){
    console.log('completed cycle');    
    stepper1.reset_current_move();
    stepper1.begin_stepping();
}

stepper1.set_callback(on_complete);
stepper1.begin_stepping(on_complete);
