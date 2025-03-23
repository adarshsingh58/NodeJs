/*require is like a import. It imports a given JS file and also runs it public features
Its like anything which is executable in a js file is static (like in java)
eg if I do,
    function x(){ console.log('ss')}; this is non-static
but doing
    function x(){ console.log('ss')}
    x(); this is executable. so this will get executed.

Below will run the greet.js file's public features.*/
require("./greet.js");