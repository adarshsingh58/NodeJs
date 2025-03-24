const logEvent=require("./loggingEvents.js")

function printHello(name){
    logEvent.emit("log","processing of PrintHello Started");
    console.log(`Hello ${name}`);
    logEvent.emit("log","processing of PrintHello Ended");
}

printHello("Adarsh");