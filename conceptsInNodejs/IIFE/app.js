var name = "singh";

(function getName() {
	var name = "adarsh";
	console.log(name);
})();

console.log(name);
/*
 * Here, the function getName is wrapped around a () which makes it an
 * expression and then it is invoked by () after }, making it to run right away.
 * This is called immediately invoked function expressions. All the variables
 * inside the expression i.e. outside () are scoped local to the expression and
 * in no way will affect outside variables
 * 
 */