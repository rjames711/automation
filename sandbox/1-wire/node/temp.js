
//
// Getting all sensors data...
//
// @chamerling
//
//from git hub test/data. Had to change the require statment. This one seems to read all sensors.

var sensor  = require('ds18b20');
var sensor_ids='i';

sensor.sensors(function(err,ids){
    console.log(ids);
    sensor_ids = ids;
});


setInterval(function(){
    sensor_ids.forEach(function(id){
        console.log('Sensor ' + id + ' (decimal) :' + sensor.temperatureSync(id));
    });
console.log();
},1000);


/*
setInterval(function(){
sensor_ids.forEach(function(id) {
    sensor.temperature(id, function(err, result) {
      if (err) {
        console.log('Can not get temperature from sensor', err);
      } else {
        console.log('Sensor ' + id + ' :', result);
      }
    });
    
  });
console.log();
},1000);

setTimeout(function(){
sensor.sensors(function(err, ids) {
  if (err) {
    return console.log('Can not get sensor IDs', err);
  }

  console.log('Sensor IDs', ids);
  ids.forEach(function(id) {
    sensor.temperature(id, function(err, result) {
      if (err) {
        console.log('Can not get temperature from sensor', err);
      } else {
        console.log('Sensor ' + id + ' :', result);
      }
    });
  });
});
},1000);

sensor.sensors(function(err, ids) {
  if (err) {
    return console.log('Can not get sensor IDs', err);
  }

  console.log('Sensor IDs', ids);
  ids.forEach(function(id) {
    console.log('Sensor ' + id + ' (decimal) :' + sensor.temperatureSync(id));
    console.log('Sensor ' + id + ' (hex) :' + sensor.temperatureSync(id, {parser: 'hex'}));
  });
});
*/
