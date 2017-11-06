//code on readme.md of git hub page. Had to change hardcoded sensor ids
var ds18b20 = require('ds18b20');
ds18b20.sensors(function(err, ids) {
  // got sensor IDs ...
});

// ... async call
ds18b20.temperature('28-0316614cd5ff', function(err, value) {
  console.log('Current temperature is', value);
});

// ... or sync call
console.log('Current temperature is' + ds18b20.temperatureSync('28-0316614cd5ff'));

// default parser is the decimal one. You can use the hex one by setting an option
ds18b20.temperature('28-0316614cd5ff', {parser: 'hex'}, function(err, value) {
  console.log('Current temperature is', value);
});

console.log('Current temperature is' + ds18b20.temperatureSync('28-0316614cd5ff', {parser: 'hex'}));
