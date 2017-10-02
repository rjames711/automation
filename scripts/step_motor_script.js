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
var steps=0;
var steps_needed = 0;
var steps_per_rev = 200*15.3;
var current_pos = 0;
var dest_pos = 180;
var end_delay=500;

cycle();

//cycles between 0 and destination position
function cycle(){
    current_pos = Math.round(current_pos);
    if (current_pos == 0 )
        go_to_dest(dest_pos,spd);
    else
        go_to_dest(0, spd);
}

//Set the direction and desired number of steps to next position and begins stepping
function go_to_dest(dest_pos, spd){
    var displacement = dest_pos - current_pos;
    console.log(dest_pos, current_pos, displacement);
    steps_needed = Math.abs(degrees_to_steps(displacement));
    if((displacement) > 0)
       change_dir(1);
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
        if(dir)
            current_pos += steps_to_degrees(1);
        else
            current_pos -= steps_to_degrees(1);
        if (steps == steps_needed) {
            steps=0;
            stop_motor();
            setTimeout(cycle, end_delay);
        }
        if ( steps % 100 ==0)
            console.log(steps, ' ', steps_needed, ' ', current_pos);
    }
});

//Both conversion functions tested ok
function steps_to_degrees(steps){
     var revs = steps / steps_per_rev;
     return revs * 360;
}
function degrees_to_steps(degs){
    var revs = degs / 360;
    return revs * steps_per_rev;
}
function run_motor(spd) {
    step_pin.pwmFrequency(spd);
    step_pin.pwmWrite(100);
}
function stop_motor(){
    step_pin.digitalWrite(0);
}
function change_dir(new_dir){
    dir=new_dir;
    dir_pin.digitalWrite(dir);
}
process.on('SIGINT', function() {
    step_pin.digitalWrite(0);
    dir_pin.digitalWrite(0);
    pigpio.terminate(); // pigpio C library terminated here
    console.log('Terminating...');
    process.exit();
});






