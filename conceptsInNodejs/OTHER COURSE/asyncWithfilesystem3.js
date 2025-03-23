const fs = require('fs');
const path = require('path');

console.log("1. Start"); // ✅ Sync

fs.readFile("file.txt", "utf8", (err, data) => { // ❌ Async
 console.log("3. File Read Completed");
});

setTimeout(() => console.log("4. Timeout done"), 1000); // ❌ Async

console.log("2. End"); // ✅ Sync


/**
 How to Identify Synchronous vs Asynchronous Code in Node.js?

 In Node.js, asynchronous code typically involves:
 ✅ Callbacks (e.g., fs.readFile, setTimeout)
 ✅ Promises (e.g., .then(), async/await)
 ✅ Event-driven APIs (e.g., process.on(), stream.on())

 🔍 General Rules to Identify Async Code

 Type	                        Sync/Async	Example
 Direct Variable Assignments	✅ Sync	    let x = 5;
 Basic console.log()	        ✅ Sync	    console.log("Hello");
 fs.readFile() (Callback)	    ❌ Async	fs.readFile("file.txt", (err, data) => {...});
 fs.readFileSync()	            ✅ Sync	    fs.readFileSync("file.txt", "utf8");
 setTimeout()	                ❌ Async	setTimeout(() => console.log("Done"), 1000);
 Promise.then()    	            ❌ Async	myPromise.then(data => console.log(data));
 await inside async function	❌ Async	await fetchData();
 */
