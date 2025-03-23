function Person(firstName) {
	this.firstname = firstName;
	printName = function() {
		console.log(this.firstname);
	};
}

//Acessing Person just like a function
/*
 *Calling Person will just execute the function Person line by line .
 *function do not return anything implicitly.
 *If you do console.log(Person("Adarsh").valueOf()); on line 15 output will be 
 *error sayin Person("Adarsh") is undefined
 */
Person("Adarsh");
//console.log(Person("Adarsh").valueOf());
