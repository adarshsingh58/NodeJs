async function resolvetest() {
    console.log("2")
    await new Promise((resolve)=>{
        console.log("3")
        resolve();
    });
    console.log("4")
    return "HESUS";
}

async function asyncCall() {
    console.log("1");
    const result = await resolvetest();
    console.log("5 Result is "+result);
}

asyncCall();

/*
*
*
* resolve() tells JavaScript that a Promise is done successfully.
✔ Without resolve(), await will hang indefinitely.
✔ resolve(value) can also pass data to .then(value => {...}) or await.
* */
