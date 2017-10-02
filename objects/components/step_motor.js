var pigpio = require('pigpio');
var Gpio = pigpio.Gpio;
var button = new Gpio(19, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.RISING_EDGE,
    });
var sensor = new Gpio(19, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.RISING_EDGE,
    });
var led = new Gpio(26, { mode: Gpio.OUTPUT });
var dir_pin = new Gpio(17, { mode: Gpio.OUTPUT });
var step_pin = new Gpio(27, { mode: Gpio.OUTPUT, alert: true });
var state = true;

button.on('interrupt', function(level) {
    steps = 0;
    state = !state;
    led.digitalWrite(state);
    if (state) {
        run_motor(500);
    }
    else {
        step_pin.digitalWrite(0);
    }

});

process.on('SIGINT', function() {
    step_pin.digitalWrite(0);
    dir_pin.digitalWrite(0);
    pigpio.terminate(); // pigpio C library terminated here
    console.log('Terminating...');
    process.exit();
});

function start_motor(delay) {
    setInterval(function() {
        state = !state;
        step_pin.digitalWrite(state);
    }, delay);
}

//start_motor(2);
var steps = 0;
step_pin.on('alert', function(level, tick) {
    if (level == 1) {
        steps++;
        if (steps == 1530) {
            dir = !dir;
            step_pin.digitalWrite(0);
            dir_pin.digitalWrite(dir);
            setTimeout(function() { run_motor(500); }, 500);
            console.log('did a 180')
            steps = 0;
        }
    }
});

run_motor(500);

var spd = 300;
var dir = true;

function begin() {
    dir_pin.digitalWrite(dir);
    //step_pin.pwmRange(50);
    setInterval(function() {
        if (spd > 700) {
            spd = 300;
        }
        else {
            run_motor(spd);
            spd += 100;
        }
    }, 2000);
}

function run_motor(spd) {
    step_pin.pwmFrequency(spd);
    step_pin.pwmWrite(100);
    console.log(spd);
}
