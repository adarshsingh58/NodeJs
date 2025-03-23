function Person(firstName) {
	this.firstname = firstName;
}

Person.prototype.printName = function() {
	console.log(this.firstname);
};

var a = new Person("Adarsh");
a.printName();
