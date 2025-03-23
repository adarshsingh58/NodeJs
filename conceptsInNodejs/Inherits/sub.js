var util = require('util');
var superC = require('./super');

function person() {
    this.firstname = '';
}

/*
 * Remember only properties attached as prototype to super FC are available when using inherits and not
 * the properties that are their in the FC itslef.
 * e.g. lastname from FC person in Super will not be available to the object created from sub
*/

util.inherits(person, superC);

module.exports = person;