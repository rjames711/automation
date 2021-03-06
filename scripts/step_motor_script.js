    var fs = require('fs');
    
   if (fs.existsSync('/sys/class/gpio')) { //Check if gpio are accessible on platform
       console.log('using real onoff module')
       var gpio_module = 'pigpio';
   }
   else {
       console.log('using fake pigpio module')
       var gpio_module = 'pigpio-mock';
   }

   var pigpio = require(gpio_module);
  
   var Gpio = pigpio.Gpio;
   var sensor = new Gpio(17, {
       mode: Gpio.INPUT,
       pullUpDown: Gpio.PUD_DOWN,
       edge: Gpio.RISING_EDGE,
   });
   var dir_pin = new Gpio(21, { mode: Gpio.OUTPUT });
   var step_pin = new Gpio(20, { mode: Gpio.OUTPUT, alert: true });
   var state = true;
   var spd = 500;
   var dir = true;
   var steps = 0;
   var steps_needed = 0;
   var steps_per_rev = 200 * 15.3;
   var current_pos = 0;
   var dest_pos = -5; //Closing position on valve fixture, offset from sensor position
   var end_delay = 500;
   var homed_in = false;
   var new_home_pass = true;
   var offset = dest_pos + 90; //subtracted number is angular disp from closed position
   var cycling = true;
   var count;

   fs.watch('run_state.txt', get_run_state);

   fs.readFile('count.txt', function(err, data) {
       if (err) {
           console.log('no count file');
           return console.log(err);
       }
       if (isNaN(data)) {
           console.log("count file isn't a number");
       }
       else {
           count = parseInt(data);
           console.log('loaded count ' + data);
       }
   });

   //rotate maximum 180 degrees trying to find home
   //sensor callback function then sets params and starts
   //cycling. This seems very hard to follow. 
   go_to_dest(90, 300);



   //cycles between 0 and destination position
   function cycle() {
       current_pos = Math.round(current_pos);
       if (current_pos == offset) {
           go_to_dest(dest_pos, spd);
           count++;
           fs.writeFile('count.txt', count + '\n', function(err) { if (err) throw err; }); //save count to file. Added error handling callback function to keep newer versoind of node from complaining.
           console.log('Count: ', count);
           //process.stdout.write("Running. Count: " +count + "        \r"); // update count in place
       }
       else
           go_to_dest(offset, spd);
   }

   //Set the direction and desired number of steps to next position and begins stepping
   function go_to_dest(dest_pos, spd) {
       var displacement = dest_pos - current_pos;
       console.log(dest_pos, current_pos, displacement);
       steps_needed = Math.abs(degrees_to_steps(displacement));
       if ((displacement) > 0) {
           change_dir(1);
       }
       else {
           new_home_pass = true;
           change_dir(0);
       }
       run_motor(spd);
   }

   //Counts steps by catching alerts when step pin is set high. 
   //stops motor and cycles when steps = steps_needed
   //Sets angular position
   if (gpio_module==='pigpio'){ //skip if not real module
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
   }

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

 if (gpio_module==='pigpio'){ //skip if not real module
   sensor.on('interrupt', function(level) {
       if (homed_in & new_home_pass) {
           new_home_pass = false;
           console.log('Found home at: ', Math.round(current_pos, ' degrees'));
           //correct for any missed steps based on position of sensor. Comment to get accuracy over time
           //current_pos=0; //actually keep commented, caused problem
       }
       else if (!homed_in) {
           homed_in = true;
           current_pos = 0;
           console.log("homed in position");
           stop_motor();
           if (cycling)
               setTimeout(cycle, 500);
       }
   });
}
   process.on('SIGINT', function() {
       console.log('shutting down');
       cycling = false;
       //steps_needed=0;
       stop_motor();

       setTimeout(function() {
           go_to_dest(dest_pos, 500);
       }, 500);

       setTimeout(cleanup, 4000);
   });

   function cleanup() {
       step_pin.digitalWrite(0);
       dir_pin.digitalWrite(0);
       pigpio.terminate(); // pigpio C library terminated here
       console.log('Terminating...');
       process.exit();
   }

   function get_run_state() {
       fs.readFile('run_state.txt', function(err, data) {
           if (err) {
               console.log('no run_state.txt file');
               return 0;
           }
           if (parseInt(data) == 1) {
               state = 0;
               cycling = 1;
               cycle();
           }
           else {
               cycling = 0;
               stop_motor();
           }
       });

   }
   
