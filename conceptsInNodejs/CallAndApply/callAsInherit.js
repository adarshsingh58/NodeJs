var util=require('util');
function person()
{
	this.firstname="Adarsh";
	this.lastname="Singh";
	}

function student(){
	person.call(this); //Here you are inheriting all the properties form person objcet to student object
	this.studentId="123";
}

var student=new student();
console.log(`Hello ${student.firstname} ${student.lastname}. Your Id is ${student.studentId}`);

