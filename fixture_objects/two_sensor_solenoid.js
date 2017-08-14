// reworking to make in to reusable object
"use strict";

//Not sure I completely understand the syntaax here. Is GPIO a list?
//Does't seem like onoff has ability to configure pullup/pulldown resistors
//2,3,4 seem to be pullup by default, 20 seems to be pulldown by default
//13 and 19 unfortunately seem to be pulldown by default 

console.log('starting');




function Two_Sensor_Solenoid(){
    this.fs = require('fs');
    this.Gpio = require('onoff').Gpio,
    this.led = new this.Gpio(26, 'out'), //changed these two values
    this.front_stop = new this.Gpio(13, 'in', 'both'),
    this.end_stop = new this.Gpio(19, 'in', 'both');
    
    this.led.writeSync(1);
    this.state=0;
    this.count=0;
    this.running = true;
    this.fs.watch('run_state.txt',this.get_run_state);
    
    this.fs.readFile('count.txt',function(err,data){
    if(err){
        console.log('no count file');
        return console.log(err);
         }
    if(isNaN(data)){
        console.log("count file isn't a number"); 
       }
    else{
    this.count=parseInt(data);    
    console.log('loaded count ' +data);
    }
 });   
    
    this.front_stop.watch(this.turn_on);
    this.end_stop.watch(this.turn_off);
    
    process.on('SIGINT', function () {
  this.led.unexport();
  this.front_stop.unexport();
});


    
}


//So it seems the frontstop watches the value of its own pin 
Two_Sensor_Solenoid.prototype.turn_on = function(){
    if (this.state==0)
    {  
        this.state=1;
        this.count++;
        this.fs.writeFile('count.txt', this.count+'\n'); //save count to file
        process.stdout.write("Running. Count: " + this.count + "        \r"); // update count in place
        if (this.count%1000==0) //stop at 1000 cycle intervals
            this.fs.writeFile('run_state.txt', 0 +'\n'); //write a zero to runstate file to stop running.
       if (this.running)
         this.led.writeSync(this.state); //turn output on
    }
}

Two_Sensor_Solenoid.prototype.turn_off=function(){
this.state=0;
this.led.writeSync(this.state);
}

function get_run_state(){
    this.fs.readFile('run_state.txt',function(err,data){
       if(err){
                console.log('no run_state.txt file');
                return 0;
                 }
    if (parseInt(data)==1){
        this.state=0;
        this.running = 1;
        this.turn_on();
    }
    else
       this.running =0; 
});   

}

module.exports=Two_Sensor_Solenoid;
