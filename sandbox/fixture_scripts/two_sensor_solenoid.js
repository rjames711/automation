//Tested with fixture dual sensor aircylinder fixture. Works correctly 
"use strict";

//Not sure I completely understand the syntaax here. Is GPIO a list?
//Does't seem like onoff has ability to configure pullup/pulldown resistors
//2,3,4 seem to be pullup by default, 20 seems to be pulldown by default
//13 and 19 unfortunately seem to be pulldown by default 

console.log('starting');

var fs = require('fs');
var Gpio = require('onoff').Gpio,
    led = new Gpio(26, 'out'), //changed these two values
    front_stop = new Gpio(13, 'in', 'both'),
    end_stop = new Gpio(19, 'in', 'both');


led.writeSync(1);
var state=0;
var count=0;

fs.readFile('count.txt',function(err,data){
    if(err){
        console.log('no count file');
        return console.log(err);
         }
    if(isNaN(data)){
        console.log("count file isn't a number"); 
       }
    else{
    count=data;    
    console.log('loaded count ' +data);
    }
 });   


front_stop.watch(turn_on);
end_stop.watch(turn_off);

//So it seems the frontstop watches the value of its own pin 
function turn_on(){
    if (count%1000==0) //stop at 1000 cycle intervals
        return;
    if (state==0)
    {
        state=1;
        led.writeSync(state);
        count++;
        process.stdout.write("Running. Count: " +count + "\r");
        fs.writeFile('count.txt', count+'\n');
    }
}

function turn_off(){
state=0;
led.writeSync(state);
}



process.on('SIGINT', function () {
  led.unexport();
  front_stop.unexport();
});

