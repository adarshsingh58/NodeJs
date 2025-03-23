var name = "Adarsh";

var greet1 = "Hi " + name;

/*
 * Below is Template literal. This helps concat strings easily then using + sign.
 * we use `` and variable inside ${}
 * It might give compilation errors in eclipse but runs fine
*/
var greet2 = `Hi ${name}`;

console.log(greet1);
console.log(greet2);