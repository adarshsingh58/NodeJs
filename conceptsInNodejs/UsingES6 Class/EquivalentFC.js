function Person(firstname, lastname) {
	this.firstname = firstname;
	this.lastname = lastname;
}

Person.prototype.greet=function(){console.log(`Hello ${this.firstname}`);};


var a=new Person("adarsh","SIngh");
a.greet();