var greetings = require("./greetings.json");
var greet = function greet() {
    console.log(greetings.en);
}

module.exports = greet;