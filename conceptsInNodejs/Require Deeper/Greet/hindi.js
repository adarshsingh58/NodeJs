var greetings = require("./greetings.json");
var greet = function greet() {
    console.log(greetings.hi);
}

module.exports = greet;