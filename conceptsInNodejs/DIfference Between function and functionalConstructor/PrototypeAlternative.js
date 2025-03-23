/*
 *Prototye is only used on Functinal Constructors i.e. it will be helpful only if the function it is
 *applied to is used with 'new' leyword to create objects
 *
 *It basically attaches additional methods which can be used along with the fields which are alreadt defined 
 *inside the FC
 */

function Person(firstName) {
	this.firstname = firstName;
	this.printName = function() {
		console.log(this.firstname);
	}
};

/*
 *In this case we have atatched/prototyped one addition method named greet to the objects created
 *from Person FC using 'new'. This new method is not the implicit part of 'a' objcet, as you can see with a.valueOf(),
 *but when we call greet, it will look for any prototyped object atatched to it and theh find this method inside 
 *that object.  
 *
 *Also, the prototyped object will have access to all the members and fields of the object 'a' so we can 
 *access them with 'this' keyword
 *
 */
Person.prototype.greet=function(){console.log("Hi, "+ this.firstname)};

var a=new Person("Adarsh");
console.log(a.valueOf());
console.log(a.firstname);
a.printName();
a.greet();