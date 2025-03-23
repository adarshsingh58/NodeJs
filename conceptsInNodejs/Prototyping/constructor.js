
/*var Person=function(firstName)
{
this.firstname=firstName;
}

Person("Adarsh");
console.log(Person.firstname);*/ //Undefined output coz value was set in finction but that is gone while accessing it later

function Person(firstName)
{
this.firstname=firstName;
}

var a=new Person("Adarsh");
console.log(a.firstname); //This will retirn Adarsh because we are now accessing the same object in whcih value was set

