const fs = require('fs');
const path = require('path');

fs.readFile(path.join(".", "hello.txt"), (err, data) => {
    console.log(`Reading the data: ${data}`);
    if(err){
        console.log("SOME ERROR in reading the hello file "+err);
    }
});


fs.rename(path.join(".", "hello.txt"), path.join(".", "hello.txt"), (err) => {
    if (err)
     console.log("SOME ERROR while renaming to namaskar "+err);
    else
     console.log("Rename to namaskar Done")
});


fs.rename(path.join(".", "hello.txt"), path.join(".", "hello.txt"), (err) => {
    if (err)
        console.log("SOME ERROR while renaming to hello "+err);
    else
        console.log("Rename to hello Done")
});


/**
 * If we run this multiple times, one of time it will fail:
 *
 * SOME ERROR while renaming to hello Error: ENOENT: no such file or directory, rename 'hello.txt' -> 'hello.txt'
 * Rename to namaskar Done
 * Reading the data: hello this is adarsh
 *
 * In this error, readFile started, found the hello file but before it finises, rename to namaskar
 * started and rename to hello also started.
 * Now before rename to namaskar can finish rename to hello started and hence cant find the file and gave err.
 * rename to namaskar was completed and meanwhile readFile fromhello was also completed and output came.
 *
 * So with async operations you cant gaurantee the order.
 *
 * So in this case, we need ti make use of callbacks
 *
 * */
