const fs = require('fs');
const path = require('path');

fs.readFile(path.join(".", "hello.txt"), (err, data) => {
    console.log(`Reading the data: ${data}`);
});


fs.readFile(path.join(".", "goodbye.txt"), (err, data) => {
    console.log(`Reading the data: ${data}`);
});

// callback/listener, eventEmitter, promise

/**
 If you run this multiple time you will see that Goodbye may be executed first sometimes and hello is executed first other time
 This is because both the methods fs.readFile have a callback in them, which means they are sent to
 event loop for execution and are picked up by thread when possible.

 No, the order is NOT guaranteed in this case.
 Why?

 ✅ fs.readFile() is asynchronous.
 ✅ Both file reads start simultaneously and run in parallel (non-blocking I/O).
 ✅ The completion order depends on file size, disk speed, and OS scheduling.
 ✅ If hello.txt is larger than goodbye.txt, goodbye.txt might finish first.

 */
