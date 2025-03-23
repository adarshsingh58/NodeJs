/*
 * We need to install body-parser package for parsing the request body and getting the
 * request parameters.
 * npm install body-parser --save
*/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var port = process.env.PORT || 3000;


app.get('/',function(req,res){
	res.send("<body> <form method='POST' action='/api'><input type='text' name='firstname'><input type='submit'></form> <body>");
	 
});

app.post('/api',urlencodedParser,function(req,res){
	res.send("<body>firstName is:" + req.body.firstname + " <body>");
	  
});

app.listen(port);