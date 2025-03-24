const fs = require("fs");
const path = require("path");

const readStr = fs.createReadStream(path.join(".", "bigFile.txt"), {encoding: "utf8"});

readStr.on("data", (chunk) => {
    console.log(chunk)
});

readStr.on("end",()=>console.log("ENTIRE FILE IS READ"))

console.log("File Ended")

/**
 * Reading a small file is fine using readFile, but with very large files, to load everything
 * in-memory at once can be expensive and may even throw outOfMemory errors.
 * So, it's best to load chunks of data one at a time and process them before bringing another
 * chunk of data in-memory.
 * For that we use FileStreams.
 *
 * Here, The order of execution between the synchronous and asynchronous parts is not guaranteed.
 * Explanation
 *     fs.createReadStream() is asynchronous and uses event-driven programming.
 *     The console.log("File Ended") runs immediately, because it's synchronous.
 *     The "data" event is triggered as chunks of the file are read, and these happen after the synchronous code has already run.
 *
 * Very Imp to know that createReadStream is an event driven programming.
 * Here we did createReadStream(), this gave us an eventEmitter 'readStr'. The readStr is an eventEmitter which emits various events.
 * We then said, "ON" emit of event named "DATA", you do what's in callback, here we are printing the output of that event.
 * This Data event is emitted, and it constantly  reads a piece of chunk from input file, when that chunk is read, the callback is called
 * and it is printed.
 *
 * This is EventDrivenProgramming.
 * Because, we cannot read the entire file in a single go, we used stream and streams reads a chunk at a time.
 * So if we have used callbacks directly, when one chunk is read that chunk would be printed but since the method to readFile
 * is over no more further chunks would be read.
 * So createReadStream, gives us an eventEmitter which is constantly emitting events and you can listen/observe/subscribe to that
 * event by using ".on" method which takes in the name of the event emitted, "data" in this case, and what to do when that event
 * is completed as callback.
 *
 * So as the chunks are being read one by one, the .on() method listens to that event using "data" event name, and keeps on
 * executing callbacks.
 *
 * This will continue until there is no more data chunk to read.
 *
 * But how will we know when its over? Using "end" eventName. Anything we want to do after the emitter stops emitting the event,
 * we put in "end" callback.
 *
 * Since "File Ended" is written at the end of file, it actually will be read first, because events are asynchronous and keep on
 * processing in background. so "File Ended" would be processed while stream is processing, hence if you want anything to happen
 * in sync after the end of event, we put that in "end" eventname.
 *
 * */
