

function binary_pin(pin, direction){
    var self=this;
    var fs = require('fs');

    if (fs.existsSync('/sys/class/gpio')) { //Check if gpio are accessible on platform
        console.log('using real onoff module')
        var gpio_module = 'onoff';
    }
    else {
        console.log('using fake onoff module')
        var gpio_module = './onoff';
    }
    
    if(direction=='out'){
        var Gpio = require(gpio_module).Gpio,
            bin_pin = new Gpio(pin, 'out');
    }
    else{
        var Gpio = require(gpio_module).Gpio,
            bin_pin = new Gpio(pin, 'in','both');
    }

//TODO CHECK IN FUNCTION IF PIN IS INPUT OR OUTPUT 
//Turns output on or off
    self.switch = function(state){
        bin_pin.writeSync(Number(self.state));
    }
    
    self.watch =function(callback){
        bin_pin.watch(callback);
    }
    
    
    
}

module.exports = binary_pin;