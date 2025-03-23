var person = {
    name: "general person",
    greet: function () {
        console.log("Hi " + this.name);
    }
};

var adarsh = Object.create(person);
/*
 *adarsh is an empty object upon creation. This concept of object creation form Object.create() is both similar yet different
 *then the conecpt of object creation in Java.
 *Here the object adarsh is created from person object, but if you do adarsh.valueOf() you will get empty object {}.
 *Because using Object.create() is a way of prototyping. We are saying that if you want to access the components of
 *person object from adarsh object you will be able to do so but adarsh object in itself is null so far.
 *
 *  SO even if adarsh.valueOf() gives you {} empty object, if you do adarsh.name you will get general person as result
 *  because NJS will look for name key in adarsh object if it will not find it, it will check that in prototype class
 *  which is person here and will  output that result.
 */
adarsh.name = "adarsh";
console.log(adarsh.valueOf());
adarsh.greet();

