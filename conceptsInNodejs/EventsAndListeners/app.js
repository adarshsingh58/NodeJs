var Constants=require("./Constants");
var EventsEmitter = require("events");
var event=new EventsEmitter();

event.on(Constants.events.GREET,function() {console.log("Hi Buddy")});
event.on(Constants.events.GREET,function() {console.log("Hey Dude")});
event.on(Constants.events.FILESAVED,function() {console.log("File is Saved")});

event.emit(Constants.events.GREET);
event.emit(Constants.events.FILESAVED);