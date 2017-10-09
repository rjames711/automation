function Step_Motor(direction_pin, stepper_pin, steps_per_rev) {

    var pigpio = require('pigpio');
    var Gpio = pigpio.Gpio;
    var dir_pin = new Gpio(direction_pin, { mode: Gpio.OUTPUT });
    var step_pin = new Gpio(stepper_pin, { mode: Gpio.OUTPUT, alert: true });

    var target = 0;
    var position = 0;
    var direction = 0;
    var movements = [];
    var current_move = 0;
    var cycling = false;
    var steps_per_rev = steps_per_rev;
    var callback;

    this.add_degrees_movement = function(degrees, speed, delay) {
        var steps = (degrees / 360) * steps_per_rev;
        this.add_movement(steps, speed, delay);
    }

    this.clear_movements = function() {
        movements = [];
    }
    this.set_position = function(new_position) {
        position = new_position
    }
    this.reset_current_move = function() {
        current_move = 0;
    }
    this.add_movement = function(new_position, speed, delay) {
        movements.push([new_position, speed, delay]);
    }

    this.set_callback = function(new_callback) {
        callback = new_callback;
    }
    this.begin_stepping = function() {
        current_move = 0;
        do_next_movement();
    }

    this.cycle = function() {
        cycling = true;
        current_move = 0;
        do_next_movement();
    }

    var do_next_movement = function() {
        if (cycling) {
            if (current_move == movements.length - 1) {
                current_move = 0;
                console.log('cycling');
            }
        }
        if (movements.length > current_move) {
            var next_move = movements[current_move],
                next_pos = next_move[0],
                spd = next_move[1],
                delay = next_move[2];
            current_move++;
            setTimeout(function() { step_to(next_pos, spd) }, delay)
        }
        else
            callback();
    }

    var step_to = function(new_position, spd) {
        set_target(new_position);
        start_motor(spd);
    }

    var start_motor = function(spd) {
        if (get_steps_needed() > 0)
            set_direction(1);
        else
            set_direction(0);
        step_pin.pwmFrequency(spd);
        step_pin.pwmWrite(100);
    }

    var stop_motor = function() {
        step_pin.digitalWrite(0);
    }

    var set_target = function(steps) {
        target = steps;
    }

    var set_direction = function(dir) {
        direction = dir;
        dir_pin.digitalWrite(dir);
    }

    var took_step = function() {
        if (direction)
            position++;
        else
            position--;
        //            console.log(position, ' ', get_steps_needed());
        if (get_steps_needed() == 0) {
            stop_motor();
            console.log(position, ' ', get_steps_needed());
            do_next_movement();
        }
    }

    var get_steps_needed = function() {
        return target - position;
    }

    step_pin.on('alert', function(level, tick) {
        if (level == 1)
            took_step();
    });

    setTimeout(function() {
        console.log(position);
    }, 1000);

}

/*
var stepper1 = new Step_Motor(17, 27);
stepper1.add_movement(50, 300, 0);
stepper1.add_movement(100, 300, 500);
stepper1.add_movement(200, 300, 250);
stepper1.add_movement(0, 700, 250);
stepper1.add_movement(-300, 700, 250);
stepper1.add_movement(0, 700, 250);
stepper1.cycle();
*/

console.log('tetst');

module.exports = Step_Motor;
