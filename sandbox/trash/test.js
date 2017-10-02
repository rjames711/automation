var steps_per_rev = 200*15.3;

console.log(steps_to_degrees(1530));
console.log(degrees_to_steps(180));

function steps_to_degrees(steps){
     var revs = steps / steps_per_rev;
     return revs * 360;
}

function degrees_to_steps(degs){
    var revs = degs / 360;
    return revs * steps_per_rev;
}