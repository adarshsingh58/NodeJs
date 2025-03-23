var http= require('http');//Import Module

/*
 * create the server and specifies inside a listener function
 * this function will be invoked when a request event occurs on listen() method on speciified IP and port no.
*/
http.createServer(function(req, res){
	res.writeHead(200,{'Content-Type':'text/html'});
	res.end('Hello world! \n');
}).listen(1223,'127.0.0.1');

console.log("Server Running...");