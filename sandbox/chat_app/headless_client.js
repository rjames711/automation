var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.emit('message', "ima beaglebone");
socket.on('disconnect', function(){});
console.log("done maybe perhaps?");
