var fs = require('fs');
var http = require('http');// Import Module

http.createServer(function(req, res) {

	if (req.url === '/') {
		res.writeHead(200, {
			'Content-Type' : 'application/json'
		});
		res.end("Welcome to my server");
	}else if (req.url === '/api') {
		res.writeHead(200, {
			'Content-Type' : 'application/json'
		});
		var jsonObj = {
			name : 'adarsh',
			age : '23'
		};
		res.end(JSON.stringify(jsonObj));
	}else{
		res.writeHead(404);
		res.end("404 Not found");
	}

}).listen(1223, '127.0.0.1');

console.log("Server Running...");