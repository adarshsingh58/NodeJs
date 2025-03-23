/*To access the exposed/exported functions/modules of other js files we need to save requrie into a variable that will hold all the exposed modules' references of the file we 'required'*/
var getHelloWithNameVar=require("./greet.js");

/*Now we use the variable name followed by () to access the modules exposed by greet.js*/
getHelloWithNameVar();