fs= require('fs')

var count=0


function set_count(new_count){
    count = new_count;
}


function read_count (callback){
    fs.readFile('count.txt', 'utf8' ,function(err,data){
        if(err){throw err}
        callback(data)
        });}

read_count(set_count)






printcount();
setInterval(printcount,100);

function printcount(){
    console.log('count: ' ,count);
}

