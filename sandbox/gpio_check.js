#!/usr/bin/env node
/**
check if gpio are available for use on system by normal means 
by checking if the sys/class/gpio directory exists
*/
var fs = require('fs');

if (fs.existsSync('/sys/class/gpio')) {
    console.log('gpio is acessible on this hardware');
}
else
    console.log('gpio is not acessible on this hardware');
