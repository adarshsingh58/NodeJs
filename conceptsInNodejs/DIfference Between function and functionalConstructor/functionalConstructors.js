function Person(firstName) {
	this.firstname = firstName;
	this.printName = function() {
		console.log(this.firstname);
	}
	
	greet =function(){
		console.log("Hi");
	}
};

/*
 * FC is different not in its functinal or initialization aspect but in its instantiation aspect.
 * A FC itself is completely same as a fucntion.
 * Difference lies in the way we use it.
 * In function perspective we simply call the function Person and let it execute. No object is create outside the 
 * Person function and none are returned either. WHich mean we don not have access to the fields and components 
 * inside a function if we simply call them
 * 
 * FC, on the other hand, is a way if using a function so as to create an object out of it which will have
 * access to every field and function inside te functin itself. This is done using the 'new' keyword
 * 
 *  A FC RETURNS THE IMPLICIT OBJCET CREATED INSIDE EVERY MODULE WHICH IS REPRESENTED BY 'this' KEYWORD.
 *  The properties you want your created object, a in this case, to have must be defined inside the function
 *  by using 'this.PROPERTY_NAME' syntax else they will not be available to your DC created object,
 *  like property function  greet in this case will not be part of object 'a';  
 *  
 *  'new' keyword essetially looks at the FC and maps all the variable names and function names to KEY
 *  and variable values and function implementatoion to VALUES ob the object created from new, 'a' in this case.
 */

var a=new Person("Adarsh");
console.log(a.valueOf());
console.log(a.firstname);
a.printName();
//a.greet(); // this will give error as greet() is only part of function and not the object created from functional constructor as it is not used with 'this' keyword
