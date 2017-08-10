var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.emit('chat message', "this is an emmision");
socket.on('disconnect',closing); 
//Really lazy way of closing after messages sent. Need to improve so closes when ready
setTimeout(closing, 1000);
function closing(){
console.log("done maybe perhaps?");
socket.disconnect();
}
