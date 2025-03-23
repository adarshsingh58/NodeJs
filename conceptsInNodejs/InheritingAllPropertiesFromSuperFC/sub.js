/*
 *We have seen before taht lastname will not be avaible by doinmg just inherit as it only
 *associate the properties prototyped to superFC, into subFC. And lastname is not prototyped to SUperFC but
 *present as its OWN property.
 *
 *So in order to get that we use call() on superFC as below
 */

var util = require('util');
var superC = require('./super');

function person() {
	superC.call(this); // This method will call the superC's FC and whatevre
	// properties are there will attach to the object passed
	// which is 'this' as in current object in this case. So now all properties
	// are available to subFC
	this.firstname = '';
}

util.inherits(person, superC);


var a=new person();
a.greet();
console.log(a.lastname);