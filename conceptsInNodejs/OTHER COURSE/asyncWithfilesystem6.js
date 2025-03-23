const fs = require('fs');
const path = require('path');


fs.readFile(path.join(".", "hello.txt"), (err, data) => {
    console.log(`Reading the data: ${data}`);
    if (err) {
        console.log("SOME ERROR in reading the hello file " + err);
    }

});

fs.rename(path.join(".", "hello.txt"), path.join(".", "namaskar.txt"), (err) => {
    if (err)
        console.log("SOME ERROR while renaming to namaskar " + err);
    else {
        console.log("Rename to namaskar Done")
    }
});

fs.rename(path.join(".", "hello.txt"), path.join(".", "hello.txt"), (err) => {
    if (err)
        console.log("SOME ERROR while renaming to hello " + err);
    else
        console.log("Rename to hello Done")
});

/**
 *
 *
 * */
