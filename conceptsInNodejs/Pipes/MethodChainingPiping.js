var fs=require('fs');
var zlib=require('zlib');

var readable=fs.createReadStream('greet.txt', {encoding:'utf8', highWaterMark:2*1024});
var writable= fs.createWriteStream('greet.gz');

var gzip=zlib.createGzip();

readable.pipe(gzip).pipe(writable); //method chaining
/*
 * After this the greet.gz will contain the comperssed file of greet.txt
 * Here we are piping the data from readable stream to gzip which is a duplex stream which means both 
 * read and write. So we put the data from greet.txt to write stream of gzip and it then streams the data 
 * to our created writable stream which is a zip file (gzip library can only stream into a zip file .gz)
 * So if you find greet.gz you will see its a zipped file of greet.txt
 * 
 * We can streamed out to anything like internet, zips etc if there is proper writabel stream available
 */
