/*
 * Now we need to get the html file from a certain location and pass it to response body instead of having my respinse
 * as a string. So, obviously, we need fs module. 
 * 
 * Here we are using stream to add data from index.html to response writable stream
 */
var fs=require('fs');
var http= require('http');//Import Module

http.createServer(function(req, res){
	res.writeHead(200,{'Content-Type':'text/html'});
	fs.createReadStream('index.html','utf8').pipe(res); 
	
}).listen(1223,'127.0.0.1');

console.log("Server Running...");