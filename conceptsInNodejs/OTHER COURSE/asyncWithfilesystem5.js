const fs = require('fs');
const path = require('path');
const e = require("express");

fs.readFile(path.join(".", "hello.txt"), (err, data) => {
    console.log(`Reading the data: ${data}`);
    if (err) {
        console.log("SOME ERROR in reading the hello file " + err);
    }

    fs.rename(path.join(".", "hello.txt"), path.join(".", "namaskar.txt"), (err) => {
        if (err)
            console.log("SOME ERROR while renaming to namaskar " + err);
        else {
            console.log("Rename to namaskar Done")

            fs.rename(path.join(".", "namaskar.txt"), path.join(".", "hello.txt"), (err) => {
                if (err)
                    console.log("SOME ERROR while renaming to hello " + err);
                else
                    console.log("Rename to hello Done")
            });
        }
    });

});

/**
 * Here we are making use of callbacks,
 * when file read is done then its callback is called, so we do renaming to namaskar there.
 * Now inside callback of rename to namaskar, we are sure to have a file named namaskar
 * so in this callback we added the code to rename back to hello.
 *
 * This way we never get error related to async operations, because now these async operations
 * are executed one after another in kind of sync way.
 *
 * But as we see this is callbacks inside callbacks, this is called callback hell.
 *
 * TO avoid this we have await and async.
 * */
