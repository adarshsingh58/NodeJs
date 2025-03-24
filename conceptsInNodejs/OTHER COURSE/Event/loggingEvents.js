const EventsEmitter = require("events");
const fs = require("fs")
const path = require("path")
const eventEmitter = new EventsEmitter();
const fspromise = fs.promises;


async function logMessage(message) {
    if (!fs.existsSync(path.join(".", "Logs")))
        await fspromise.mkdir(path.join(".", "Logs"), (err) => {
            if (err) {
                console.log("Error creating Dir: " + err);
                throw err;
            }
        });
    await fspromise.appendFile(path.join(".", "Logs", "programLogs.txt"), message + "\n")
        .catch((rejected) => {
            console.error(rejected)
        });
}

eventEmitter.on("log", (message) => {
    logMessage(message);
});

module.exports = eventEmitter;