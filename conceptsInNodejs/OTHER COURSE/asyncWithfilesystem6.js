const fs = require('fs');
const path = require('path');
const fsPromise = fs.promises;

async function executeMyFlow() {
    const data = await fsPromise.readFile(path.join(".", "hello.txt"), 'utf8');
    console.log(data);

    try {
        await fsPromise.rename(path.join(".", "hello.txt"), path.join(".", "namaskar.txt"));
        console.log("renaming to namaskar completed")
    } catch (e) {
        console.log("SOME ERROR renaming to namaskar");
    }

    try {
        await fsPromise.rename(path.join(".", "namaskar.txt"), path.join(".", "hello.txt"));
        console.log("renaming to hello completed")
    } catch (e) {
        console.log("SOME ERROR renaming to hello");
    }
}

executeMyFlow();


/**
 * you cannot use await directly on fs.readFile() because it uses a callback-based API, not a Promise-based one.
 * Node.js provides a Promise-based version of fs.readFile(), which allows you to use await.
 * 1️⃣ fs.promises.readFile() returns a Promise, which can be awaited.
 * 2️⃣ The function is marked async, allowing await inside it.
 * 3️⃣ The try/catch block handles errors properly.
 *
 * Promise based APIs DO NOT have callback arguments. If you want to trace error, we need to use try catch block.
 * And to get data we get returnType from promise based API
 * Also, await is only valid in async functions and the top level bodies of modules, so we cannot keep readFile in open
 *
 * Now using async with a function itself it a promise based function/api so we can use await with that as well.
 * */
