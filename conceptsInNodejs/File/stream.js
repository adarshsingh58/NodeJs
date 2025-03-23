var fs=require('fs');
var readablePlain=fs.createReadStream('greet.txt');
readablePlain.on('data',function(chunk){console.log(chunk)});

var readableEncoding=fs.createReadStream('greet.txt', {encoding:'utf8'});
readableEncoding.on('data',function(chunk){console.log(chunk)});

var readableWatermark=fs.createReadStream('greet.txt', {encoding:'utf8', highWaterMark:2*1024});
readableWatermark.on('data',function(chunk){console.log(chunk.length)});

var writable= fs.createWriteStream('greet1.txt');
writable.write("hi");