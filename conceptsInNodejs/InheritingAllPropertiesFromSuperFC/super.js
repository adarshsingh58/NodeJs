
function person()
{
	this.lastname='adarsh';
	}

person.prototype.greet=function(){console.log("hi")};

module.exports=person;