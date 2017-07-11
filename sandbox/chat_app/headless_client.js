var socket = require('socket.io-client')('https://automation-rjames711.c9users.io/');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
socket.emit('message', "a message");