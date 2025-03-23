function Person(firstName) {
	this.firstname = firstName;
}

Person.prototype.printName = function() {
	console.log("firstName from prototpe method:"+this.firstname);
};

var a = new Person("Adarsh");

a.printName();//Runs the function not in Person module but in Prototype module added with Person
console.log("firstName from console:"+a.firstname);//Gets the proprty associated with the object obtained using new keywor
console.log(a.valueOf());//get the value of object in Object Literal/JSON type format
console.log(a.constructor);// gives the name of the constructor
console.log(a.hasOwnProperty("firstname"));//tells if the object conatins a property named firstname or not

console.log(a.__proto__); // Gives the  name of the module prototyped on Person

