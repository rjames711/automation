

var fs = require('fs');


const Test_Obj = require("./test_obj.js");
var athing= new Test_Obj();
setInterval(print_count,1000);


function get_file_data(){    
    function set_count(count) {athing.count=count} //Sets the count in the created object.
    function read_count (callback){
        fs.readFile('count.txt', 'utf8' ,function(err,data){
            if(err){throw err}
            callback(data)
            });}
    read_count(set_count)
}


get_file_data();

function print_count(){ console.log('Count in object '+athing.count); }

