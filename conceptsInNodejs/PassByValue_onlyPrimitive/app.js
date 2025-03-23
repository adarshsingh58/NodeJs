/*
 * Because value of a is passed to getName,the value is now stored in a seperate variable b.
 * So any changes to b will not affect a.
 * This is because a and b both holds primitive data
 */
function getName(b) {
	b = 2;
}

var a = 1;
getName(a);
console.log(a);