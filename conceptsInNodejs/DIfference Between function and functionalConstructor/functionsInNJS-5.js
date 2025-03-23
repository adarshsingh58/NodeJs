function Person(firstName) {
	this.firstname = firstName;
	printName = function() {
		console.log(this.firstname);
	};
	return this;   //Wrong
}

/*
 * You cannot return an object from a function like line 5 and capture it in a variable like like 14
 * This will give you undefined everytime because the module object is protected and cannot
 *  be simply returned like this.
 */
var a=Person();
console.log(a.name);
a.printName();



