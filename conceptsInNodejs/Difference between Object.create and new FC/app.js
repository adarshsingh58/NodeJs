/*
 * There is no difference between creation of object by using new keyword on FC and then prototyping 
 * and using Object.create()
 */

//USING 'new' on FC
function Person(firstname, lastname) {
	this.firstname = firstname;
	this.lastname = lastname;
}
Person.prototype.getName = function() {
	console.log(this.firstname + " " + this.lastname);
}

var adi = new Person("Adarsh", "Singh");
adi.getName();


//Using Object.create
var Personvar={
		firstname:'',
		lastname:'',
		getName:function(){console.log(this.firstname+" "+this.lastname)}
}

var adi=Object.create(Personvar);
adi.firstname="Adarsh";
adi.lastname="Singh";
adi.getName();

/*
 * So we see that in FC and 'new' , we create a function and prototype methods to them, so any object created from this FC using new
 * will inherit all those properties it has.
 * 
 * 
 * In Object.create, we create an object itself with all the basic fields set up and any object created from it
 * will inherit those properties.
 */
