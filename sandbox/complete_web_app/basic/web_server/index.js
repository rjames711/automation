var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var count=0;
var speed=1000;
var run_state=0;
var fs =require('fs');
const fixture = require('../fixture_objects/two_sensor_solenoid.js')
var mach= new fixture();
console.log('importing fixture object: ', mach.name);

/**** Method for reading count. Don't mess with unless you mean to ****/
function get_file_data(){    
    function set_count(count) {mach.count=count} //Sets the count in the created object.
    function read_count (callback){
        fs.readFile( __dirname + '/count.txt', 'utf8' ,function(err,data){
            if(err){throw err}
            callback(data)
            });}
    read_count(set_count)
}
get_file_data();
/****End Method for reading count. Don't mess with unless you mean to ****/


mach.notify = function(){
  count= mach.count;
  count_up();
}


function start_all(){
if(run_state == 0){
  run_state = setInterval(count_up,speed);
}
else{
  console.log("Interval already set");
  io.emit('command', "SERVER: Interval already set");
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



function param_error(){
   console.log("Wrong Number of parameters");
    io.emit('command', "SERVER: Wrong Number of parameters" )
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
  socket.on('command', function(msg){
    io.emit('command', msg);
    /*
    Custom Commands recieved as command here
    TODO implement this maybe with a dictionary / hashmap structure
    with structure commands = { command : function } and just do single check
    if the command is in the map and if so call the accompannying function else move on
    
    */
    var cmd = msg.split(" ");
    
    console.log(cmd[0]);
    console.log(cmd[1]);
    if(cmd[0]=='start')         start_all();
    else if (cmd[0]=='stop')    stop_all();
    else if (cmd[0]=='count')   set_count(cmd);
    // End custom commands
  });

});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
