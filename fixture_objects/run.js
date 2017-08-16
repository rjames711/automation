const Two_Sensor_Solenoid = require("./two_sensor_solenoid.js");

fixture=new Two_Sensor_Solenoid();

console.log('in run')
console.log(fixture.count);

//setInterval(function(){console.log(fixture.count);},1000);
setInterval(fixture.read_count,1000);