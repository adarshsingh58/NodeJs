/*
 *Here, file fs has 2 methods for reading. readFileSync and readFile
 *Former is synchronous which means untill he reading is not completed the control wont move forward
 *
 * Latter is async means, we provide a call back method to it, whose first param is err funtion and 
 * second is the data parameter which is our value read form the file. This method will be called whenever
 * the reading of file completes. Untill then the control moves to next line.
 * 
 * That is why output is:
 * 	Hello
	Done!
	Hello
 * and not Hello Hello Done!
 * As fs starts reading but do not wait for reading to complete. By he time reading completes,
 * next line i.e. Done! is executed and whenreading completes, data from the file is printed.
 * 
 * The reason of having the callback function like function(err,data) is to always have first parameter 
 * as a error value. This value contains info regarding if any error or exeption has arrived while
 *  executing the function. If so it will contain the info abt it and if not it will be null. So, it can be
 *  used to check if the function is executed properly. Second param can have actual value obtained frmo 
 *  reading the file. This apprach is called ERROR-FIRST CALLBACK
 *  
 *  The reason we use callback in async function calls is because in synchronous calls we know we move
 *  control to next line only when the operation is completed, so call bck is not required.
 *  In Async, we are moving forward to next line of execution, so we need to know when the function call 
 *  has completed. For that callback functions are used, they are called back by main asunc function 
 *  when they are done executing. This way we can put anything in our callback function that may help
 *  use notify about the completion of the operation.
 *  
 *  For this reason always use async method,if available, over sync method as this makes our application
 *  faster and provide good experience for user.
 *  
 */
var fs=require('fs');

var greet = fs.readFileSync('./greet.txt','utf8');
console.log(greet);

fs.readFile('./greet.txt','utf8',function(err,data){
	if(err==null)
	    console.log(data);
});

console.log("Done!");