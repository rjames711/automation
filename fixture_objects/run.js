
var fs = require('fs');


const Two_Sensor_Solenoid = require("./two_sensor_solenoid.js");
var mach= new Two_Sensor_Solenoid();


/**** Method for reading count. Don't mess with unless you mean to ****/
function get_file_data(){    
    function set_count(count) {mach.count=count} //Sets the count in the created object.
    function read_count (callback){
        fs.readFile('count.txt', 'utf8' ,function(err,data){
            if(err){throw err}
            callback(data)
            });}
    read_count(set_count)
}
get_file_data();
/****End Method for reading count. Don't mess with unless you mean to ****/


setTimeout(function(){ console.log( 'count in object:', mach.count)}, 100);
/*
setTimeout(function(){mach.led.writeSync(1)},20);// this works.

setTimeout(mach.turn_off,3000);// this throws error and doesn't work.

setInterval(dumb_blink, 2000);


function dumb_blink() {
mach.turn_on();
setTimeout(mach.turn_off,1000);
}
*/
