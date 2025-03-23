
var fs=require('fs');
var http= require('http');//Import Module

http.createServer(function(req, res){
	res.writeHead(200,{'Content-Type':'application/json'});
	
	var jsonObj={name:'adarsh',age:'23'};
	res.end(JSON.stringify(jsonObj));
	
}).listen(1223,'127.0.0.1');

console.log("Server Running...");