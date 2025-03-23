function Person(firstName) {
	this.firstname = firstName;
	printName = function() {
		console.log(this.firstname);
	};
	return printName;
}

//Acessing Person just like a function
/*
 *Also the function inside the Person function will only execute if it is called within itself (like on line 6) 
 *or is returned to be called from outside (like on like 6 with line 14) .
 */
console.log(Person("Adarsh")());
