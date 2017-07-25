var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port);
app.set('view engine', 'pug');
app.set('views','./views'); //somehow allows me to use views directory with the pug file
// first parameter is the mount point, second is the location in the file system
app.use(express.static(__dirname + '/public')); //somehow allows me to use stylsheets folder

//ok so apparently it like adding the directory to an envirement path where it checks for files.
var count=0;


var tools = require('./lib/tools.js');
var value = tools.sum(10,20);
console.log("Value: "+value);
var items=tools.items;

setInterval(count_up,1000);

function count_up(){
  io.emit('count',count);
  count++;
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.get('/table', function(req, res){
   res.render('first_view', {title: 'autolab', items});
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});