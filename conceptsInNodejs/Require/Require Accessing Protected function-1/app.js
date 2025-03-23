/*require is like a import. It imports a given JS file and also runs it public features
Below will run the greet.js file's public features.*/
require("./greet.js");

/*Calling this here will give error "Error: Cannot find module" as we cannot directly access protcted components from another Js file just by doing a require import of the file*/
getHelloWithName();