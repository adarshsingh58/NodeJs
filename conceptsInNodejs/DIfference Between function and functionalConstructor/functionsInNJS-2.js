function Person(firstName) {
	this.firstname = firstName;
	printName = function() {
		console.log(this.firstname);
	};
	return "Hello";
}

//Acessing Person just like a function
/*
 *If you return anything from function like line no 6 then only we can get some value. If we have line 7 and 24 open
 *we will get string output Hello. 
 */
Person("Adarsh");
console.log(Person("Adarsh").valueOf());
