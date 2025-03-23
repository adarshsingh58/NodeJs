var subC=require('./sub');

var a=new subC();
a.greet();
/*
 * Remeber only properties atatched as prototype to super FC are avalable when using inherits and not
 * the properties that are their in the FC itslef. 
 * 
 * e.g. lastname from FC person in Super will not be available to the object created from sub
*/
//console.log(a.lastname);