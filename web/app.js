var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var speed=1000;
var run_state=0;
var fs =require('fs');
var count =0;
const fixture = require('../objects/fixtures/two_sensor_solenoid/two_sensor_solenoid.js')
var mach= new fixture();
console.log('mach path', mach.path);
console.log('forwarded info', mach.forwarded_info);

//TODO Need to move html and css file to public subdirectory 
var path = require('path');
app.use(express.static(__dirname)); // Current directory is root
//app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root



/**** Method for reading count. Don't mess with unless you mean to ****/
function get_file_data(){    
    function set_count(count) {mach.count=count} //Sets the count in the created object.
    function read_count (callback){
        fs.readFile( mach.path + '/count.txt', 'utf8' ,function(err,data){
            if(err){throw err}
            callback(data)
            });}
    read_count(set_count)
}
get_file_data();
/****End Method for reading count. Don't mess with unless you mean to ****/

mach.notify = function(){
  //console.log(mach);
  //console.log();
  //console.log(JSON.stringify(mach));
 
  
  count= mach.count;
  io.emit('count',count);
  io.emit('data' ,JSON.stringify(mach));
}


function start_all(){
    mach.restart();
}


function stop_all(){
    mach.shut_off();
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

//ROUTES
app.get('/', function(req, res){
    res.sendFile(__dirname + '/jq.html');
    io.emit('count', mach.count);
});

app.get('/ng', function (req, res) {
  res.sendFile(__dirname + '/ng.html')
});

app.get('/js', function (req, res) {
  res.sendFile(__dirname + '/js.html')
});

app.get('/jq', function (req, res) {
  res.sendFile(__dirname + '/jq.html')
});

app.get('/doc', function(req, res){
  res.sendFile(__dirname + '/water dispersion fixture.mht');
});
//END ROUTES

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
