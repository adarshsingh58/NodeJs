/*
 * By simply using [] with equal operator the var is referenced as an array variable
 * THen we can use properties of array like push to add data, pop to remove ... etc 
 */
var arr=[];
arr.push("adarsh");
console.log(arr.length);
console.log(arr.pop());
console.log(arr.length);

/*We can add any object in array */
arr.push(function() {
	console.log("Inside my function");
});

arr.pop()(); //beacause the popped value is a fuction we can invoke it by using () after it. 

/*we can use forEach function of arrays also*/
arr.push(function() {
	console.log("Inside my function part 1");
});

arr.push(function() {
	console.log("Inside my function part 2");
});

arr.push(function() {
	console.log("Inside my function part 3");
});

for (var int = 0; int < arr.length; int++) {
	arr.pop()();
}
