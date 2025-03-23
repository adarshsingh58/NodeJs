//run this using node processTest.js HENLO
//process.argv[] 0th index is node's location, 1st index is file name and 2nd onwards is any custom input you pass
const greeting=`Hello`

if(process.argv[2])
    console.log(`${process.argv[2]} adarsh`)
else
    console.log(`${greeting} Adarsh`)