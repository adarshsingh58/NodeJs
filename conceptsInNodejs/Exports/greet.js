console.log(exports);
console.log(module.exports);


exports.greet={"greet":"hi"};
console.log(exports);
console.log(module.exports);


/*
 * we know that exports and module.exports are same thing and points to same value.
 * exports is just a short hand of module.exports. 
 * In this case, when data inside exports object is changed and an object is added inside it
 * both exports and module.exports changed coz they point to same value.
 */
