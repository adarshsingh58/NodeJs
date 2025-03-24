const fs = require('fs');
const path = require('path');

console.log("1");
console.log("2");
console.log("3");
console.log("4");
console.log("5");
console.log("6");
console.log("7");
console.log("8");
console.log("9");
console.log("10");

/**
 As opposed to some line like console.log() which do not have callback, they will always execute in
 sequence.

 in this case, the output is guaranteed to follow the exact order 1-10 because:

 ✅ JavaScript executes synchronous code line by line in the order written.
 ✅ There are no asynchronous operations (like setTimeout, Promise, fs.readFile) that could affect execution order.
 */
