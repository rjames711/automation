var fs = require('fs');

/*
Object Constructor
*/
function Test_Obj(){

//Variables
this.count=0;

//Methods
this.set_count = function (new_count){
    console.log(new_count);
    count = new_count;
    console.log(this.count);
}


this.read_count =function (callback){
    fs.readFile('count.txt', 'utf8' ,function(err,data){
        if(err){throw err;}
        callback(data)
        });}

}





/*
Necessary for export to another file
*/
module.exports = Test_Obj;