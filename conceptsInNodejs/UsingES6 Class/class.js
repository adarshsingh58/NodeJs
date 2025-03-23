'use strict'

class Person{
	
	constructor(firstname,lastname)
	{
		this.firstname=firstname;
		this.lastname=lastname;
	}
	
	greet()
	{
		console.log(`Hello ${this.firstname}`);
	}
}

var a=new Person("adarsh","SIngh");
a.greet();

