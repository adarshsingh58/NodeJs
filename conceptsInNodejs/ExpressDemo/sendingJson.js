var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/api',function(req,res){
	res.json({firstname:'Adarsh',lastname:'Singh'});
});

app.listen(port);