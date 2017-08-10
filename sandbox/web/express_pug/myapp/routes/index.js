var express = require('express');
var router = express.Router();
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AutoLab', items  });
});

module.exports = router;
