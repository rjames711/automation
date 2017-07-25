var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port);
app.set('view engine', 'pug');
app.set('views','./views'); //somehow allows me to use views directory with the pug file
app.use(express.static(__dirname + '/public')); //somehow allows me to use stylsheets folder
var count=0;

setInterval(count_up,1000);

function count_up(){
  io.emit('count',count);
  count++;
}

var items = [
    {code: 'A1', name: 'Count', description: '0'}, 
    {code: 'A2', name: 'Soda2', description: 'a very long string which will make the tabler longer'}, 
    {code: 'A3', name: 'Soda3', description: 'desc3'}, 
    {code: 'A4', name: 'Soda4', description: 'desc4'}, 
    {code: 'A5', name: 'Soda5', description: 'desc5'}, 
    {code: 'A6', name: 'Soda6', description: 'desc6'}, 
    {code: 'A7', name: 'Soda7', description: 'desc7'}, 
    {code: 'A8', name: 'Soda8', description: 'desc8'}, 
    {code: 'A9', name: 'Soda9', description: 'desc9'}, 
    {code: 'A10', name: 'Soda10', description: 'desc10'}, 
    {code: 'A11', name: 'Soda11', description: 'desc11'}
];

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.get('/first_template', function(req, res){
   res.render('first_view', {title: 'autolab', items});
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});