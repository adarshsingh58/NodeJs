console.log(exports);
console.log(module.exports);

exports = {
	"greet" : "hi"
};
console.log(exports);
console.log(module.exports);

/*
 * we know that exports and module.exports are same thing and poits to same
 * value. exports is just a short hand of module.exports. In this case, when
 * exports object itself is changed and is amde equvalent to a different object
 * then exports started to point to a different memory location as it is now
 * associated with a different object and module.exppotrts points to old object
 * value in memory. Hence module.export is unchanged
 */
