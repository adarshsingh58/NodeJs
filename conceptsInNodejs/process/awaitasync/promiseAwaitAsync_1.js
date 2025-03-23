async function resolvetest() {
    console.log("Hello Resolve")
    await setTimeout(()=>{console.log(" Timeout completed")},2000);
    return "HESUS";
}

async function asyncCall() {
    console.log("calling");
    const result = await resolvetest();
    console.log("Result is "+result);
    // Expected output: "resolved"
}

asyncCall();

/*
* The issue is that setTimeout does not return a Promise, so await setTimeout(...)
* does not actually wait for the timeout to complete. Instead, setTimeout starts the
* timer, and the function continues executing without waiting.
* */
