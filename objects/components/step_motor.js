function step_motor(dir_pin, step_pin, steps_per_rev) {
    var pigpio = require('pigpio');
    var Gpio = pigpio.Gpio;
    var sensor = new Gpio(19, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.RISING_EDGE,
    });
    var dir_pin = new Gpio(17, { mode: Gpio.OUTPUT });
    var step_pin = new Gpio(27, { mode: Gpio.OUTPUT, alert: true });
    var state = true;
    var spd = 700;
    var dir = true;
    var steps = 0;
    var steps_needed = 0;
    var steps_per_rev = 200 * 15.3;
    var current_pos = 0;
    var dest_pos = 60;
    var end_delay = 500;
    var homed_in = false;
    var new_home_pass = true;
    var offset = dest_pos - 180;
    var cycling = true;

    //Set the direction and desired number of steps to next position and begins stepping
    function go_to_dest(dest_pos, spd) {
        var displacement = dest_pos - current_pos;
        console.log(dest_pos, current_pos, displacement);
        steps_needed = Math.abs(degrees_to_steps(displacement));
        if ((displacement) > 0) {
            change_dir(1);
            new_home_pass = true;
        }
        else
            change_dir(0);
        run_motor(spd);
    }

    //Counts steps by catching alerts when step pin is set high. 
    //stops motor and cycles when steps = steps_needed
    //Sets angular position
    step_pin.on('alert', function(level, tick) {
        if (level == 1) {
            steps++;
            if (dir)
                current_pos += steps_to_degrees(1);
            else
                current_pos -= steps_to_degrees(1);
            if (steps >= steps_needed) {
                steps = 0;
                stop_motor();
                if (cycling)
                    setTimeout(cycle, end_delay);
            }
            if (steps % 100 == 0)
                console.log(steps, ' ', steps_needed, ' ', current_pos);
        }
    });

    //Both conversion functions tested ok
    function steps_to_degrees(steps) {
        var revs = steps / steps_per_rev;
        return revs * 360;
    }

    function degrees_to_steps(degs) {
        var revs = degs / 360;
        return revs * steps_per_rev;
    }

    function run_motor(spd) {
        step_pin.pwmFrequency(spd);
        step_pin.pwmWrite(100);
    }

    function stop_motor() {
        step_pin.digitalWrite(0);
        steps_needed = 0;
    }

    function change_dir(new_dir) {
        dir = new_dir;
        dir_pin.digitalWrite(dir);
    }

    sensor.on('interrupt', sensor_handler);
    
    function sensor_handler(level){
    }

    process.on('SIGINT', function() {
        console.log('shutting down');
        cycling = false;
        stop_motor();

        setTimeout(function() {
            go_to_dest(offset, 500);
        }, 500);

        setTimeout(cleanup, 3000);
    });

    function cleanup() {
        step_pin.digitalWrite(0);
        dir_pin.digitalWrite(0);
        pigpio.terminate(); // pigpio C library terminated here
        console.log('Terminating...');
        process.exit();
    }
}
