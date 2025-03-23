const eventEmitter = require('events')

//publisher or event emitter
const celebrity=new eventEmitter();

//subscriber or observer or event listener 1
celebrity.on('race win', function (){console.log("Great!!!")});
//subscriber or observer or event listener 2
celebrity.on('race win',  ()=> {console.log("WOW MAN!!!")});
//subscriber or observer or event listener 3 which responds based on result
celebrity.on('race win',  (arg_result)=> {
    if(arg_result === '20sec')
        console.log("That was Fast");
    else
        console.log("Congrats but not your best");
})

celebrity.emit('race win' );
celebrity.emit('race win', "20sec");


