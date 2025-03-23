function getName(b) {
    b.name = "Adarsh"; //key 'name' and value 'Adarsh' added to object b
}

var a = {};//empty object with no key value
console.log(a.valueOf()); //value of a before method call
getName(a);//method called
console.log(a.valueOf());  //value of a after method call
console.log(a);  //value of a after method call
