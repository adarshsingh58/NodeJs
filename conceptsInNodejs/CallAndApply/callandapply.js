var obj = {
	lastname : "singh",
	getName : function() {
		console.log("Adarsh " + this.lastname);
	}
}

/*
 * direct calling a function with (), calling with call() and with apply() does
 * the same thing of invoking the function
 */

obj.getName();
/*
 * One Difference is that when use call() or apply() any data stored in the
 * object whose function is called will not be considered and will be
 * overwritten by the object passwd as first parameter of these function. If no
 * first parameter is passed that means empty object is passed.
 * 
 * In below example lastname will be undefined for call() and apply() because
 * the values stored in obj object, which were accessible by 'this' keyword are
 * overriden by new empty object so this.lastname does not exist
 */
obj.getName.call();

obj.getName.apply();

/*
 * we can pass new object as below. So here what we have dine is that we invoked
 * a method that belonged to obj object but instead of using obj object as
 * reference for values and properties, we passed our objcet to be used by the
 * function if needed.
 * 
 * So, in a way call() and apply() is used to borrow functions of other modules
 * to run with the object we pass.
 */
obj.getName.call({
	lastname : "Jane"
});

obj.getName.apply({
	lastname : "Jonny"
});


