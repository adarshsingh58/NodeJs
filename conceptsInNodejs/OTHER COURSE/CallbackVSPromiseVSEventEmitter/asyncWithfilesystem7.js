const fs = require('fs');
const path = require('path');
const fsPromise = fs.promises;

fsPromise.readFile(path.join(".", "hello.txt"), 'utf8')
    .then((resolved) => console.log(resolved))
    .catch((rejected) => console.log("Some error occured while reading the file" + rejected))

fsPromise.rename(path.join(".", "hello.txt"), path.join(".", "namaskar.txt"))
    .then((resolved) => console.log("renaming to namaskar completed"))
    .catch((rejected) => console.log("SOME ERROR renaming to namaskar"));

fsPromise.rename(path.join(".", "namaskar.txt"), path.join(".", "hello.txt"))
    .then((resolved) => console.log("renaming to hello completed"))
    .catch((rejected) => console.log("SOME ERROR renaming to hello"));


/**
 * Now using async with a function itself it a promise based function/api so we can use await with that as well.
 * This allows to use something called Promise Chaining
 * A callback is a function passed as an argument to another function. It is executed after the operation is completed
 * A Promise represents the eventual completion (or failure) of an asynchronous operation. Instead of using callbacks, it allows chaining .then() and handling errors with .catch().
 *
 * There are two ways of calling Promise based APIs,
 * - using async/await: used in asyncWithfilesystem6.js
 * - using chaining: used here in asyncWithfilesystem7.js
 *
 * PROBLEM: The order is not guaranteed in this code because Promises in JavaScript execute asynchronously
 * and do not block the execution of the next statement.
 * Each fsPromise method runs independently and does not wait for the previous one to finish before executing the next.
 *
 * Since all three operations (readFile, rename, rename back) are asynchronous, they can complete in any order, depending on:
 *     I/O speed: File reading may take longer than renaming.
 *     File system behavior: Rename operations might execute faster than reading a file.
 *     Event loop scheduling: JavaScript does not guarantee execution order of independent async tasks.
 *
 * You might get outputs like:
 *     renaming to namaskar completed
 *     SOME ERROR renaming to hello
 *     Some error occured while reading the fileError: ENOENT: no such file or directory, open './hello.txt'
 *
 * How to Guarantee Order?
 * Use Promise chaining or async/await:
 *
 * So here, when we do fsPromise.xyz.then(). in that case .then() is equivalent to callback. Whatever we want to be done
 * post successful execution of promise is called inside .then() and anything that fails inside .catch()
 * From earlier it is equivalent to try and catch.
 *
 * the diff between try and .then is that, .then() by default uses async/await, i.e. whatever we put inside .then() will execute
 * only when the main promise function is completed. Unlike in try catch based (check asyncWithfilesystem6.js) where we add await and async keyword
 * to make sure promise which runs asynchronously waits before moving to next line.
 *
 * */
