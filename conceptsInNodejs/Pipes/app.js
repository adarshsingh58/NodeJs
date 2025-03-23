var fs = require('fs');

var readable = fs.createReadStream('greet.txt', {encoding: 'utf8', highWaterMark: 2 * 1024});
var writable = fs.createWriteStream('greet1.txt');

readable.pipe(writable);