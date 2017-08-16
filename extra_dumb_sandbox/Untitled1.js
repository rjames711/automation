var count=0;    
fs=require('fs');

fs.readFile('count.txt',function(err,data){
    if(err){
        console.log('no count file');
        return console.log(err);
         }
    if(isNaN(data)){
        console.log("count file isn't a number"); 
       }
    else{
    count=parseInt(data);    
    console.log('loaded count ' +data);
    }
 });   

setTimeout(function() {console.log('count outside class is '+ count);}, 100);

