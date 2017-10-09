const step_object = require('../objects/components/step_motor.js')
var stepper1 = new step_object(17, 27, 200);

stepper1.add_degrees_movement(180, 700, 250)
