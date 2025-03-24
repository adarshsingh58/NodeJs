const fs = require('fs');
const path = require('path');
const fsPromise = fs.promises;

fsPromise.readFile(path.join(".", "hello.txt"), 'utf8')
    .then((resolved) => {
        console.log(resolved);
        fsPromise.rename(path.join(".", "hello.txt"), path.join(".", "namaskar.txt"))
                 .then((resolved) => {
                        console.log("renaming to namaskar completed");
                        fsPromise.rename(path.join(".", "namaskar.txt"), path.join(".", "hello.txt"))
                                 .then((resolved) => console.log("renaming to hello completed"))
                                 .catch((rejected) => console.log("SOME ERROR renaming to hello"));
                })
                .catch((rejected) => console.log("SOME ERROR renaming to namaskar"));
    })
    .catch((rejected) => console.log("Some error occured while reading the file" + rejected))


/**
 * Here, now we have our synchronous order in play using chaining.
 * Functionally, your code is equivalent to the async/await version because it ensures
 * that each operation happens only after the previous one completes. However, here as well our approach
 * has a problem: callback nesting, also known as "callback hell." Similarly to asyncWithfilesystem5.js
 * just with Promises now.
 *
 * */
