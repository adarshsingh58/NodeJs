/*A .JS file executes automatically when either run by itself ot is run by calling inside a different
js file by require()
Remember only public features like console.log() will run by themselves coz they
are open in the file not enclosed in brackets .*/
console.log("Hello");

/*Anything inside a function is protected and cannot be accessed by an outside class directly*/
/*Below function will not run just b adding require as this is inside function and not open code. Other file need to call it explicitly to running it*/

function getHelloWithName()
{
	console.log("Hello! Adarsh");
}

 /*For other js files to access the contents like fuctions/modules of this file we need to explicitly export
 the functions/modules of this files that will be open for other files to use*/
 module.exports=getHelloWithName;