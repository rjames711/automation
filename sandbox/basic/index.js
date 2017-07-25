var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var count=0;
var speed=1000;
var run_state=0;

function start_all(){
if(run_state == 0){
  run_state = setInterval(count_up,speed);
}
else{
  console.log("Interval already set");
  io.emit('chat message', "SERVER: Interval already set");
}

console.log(run_state._called);
}

function count_up(){
  count++;
  io.emit('count',count);
}

function stop_all(){
  clearInterval(run_state);
  console.log(run_state._called);
  run_state=0;
}

function set_speed(cmd){
  if (cmd.length==2){
    stop_all();
    // probably horrible contemptable loathsome usage of globals for which I'll go promptly to hell need to find how to structure this stuff in js
    //But right now its taken the second part of the command as a speed parameter, 
    //setting the global variable and restarting the interval  
    speed= cmd[1];  
    io.emit('interval', cmd[1]);
    start_all();
  }
  else{
   param_error();
  }
}

function param_error(){
   console.log("Wrong Number of parameters");
    io.emit('chat message', "SERVER: Wrong Number of parameters" )
}

function set_count(cmd){
  if (cmd.length==2){
    stop_all();
    count=cmd[1]-1;
    count_up();
  }
  else
    param_error();
  
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/doc', function(req, res){
  res.sendFile(__dirname + '/water dispersion fixture.mht');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    /*
    Custom Commands recieved as chat message here
    TODO implement this maybe with a dictionary / hashmap structure
    with structure commands = { command : function } and just do single check
    if the command is in the map and if so call the accompannying function else move on
    
    */
    var cmd = msg.split(" ");
    
    console.log(cmd[0]);
    console.log(cmd[1]);
    if(cmd[0]=='start')         start_all();
    else if (cmd[0]=='stop')    stop_all();
    else if (cmd[0]=='speed')   set_speed(cmd);
    else if (cmd[0]=='count')   set_count(cmd);
    // End custom commands
  });

});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
