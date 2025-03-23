/*
* The resolvetest() function waits for the Promise to resolve using await.
Once resolved, myPromise holds the resolved value "5", not a Promise anymore.
You are calling .then() on "5", which is not a Promise, causing an error.
*
* Key Takeaways

✔ await extracts the resolved value from a Promise.
✔ Once awaited, the result is no longer a Promise.
✔ Don't use .then() on a non-Promise value.
*
*
* */
async function resolvetest() {
    console.log("2")
    const myPromiseOutput = await new Promise((resolve) => {
        console.log("3")
        resolve("5");
    });
    return myPromiseOutput;
}

async function asyncCall() {
    console.log("1");
    let myPromiseString = await resolvetest();
    console.log(myPromiseString);
}

asyncCall();
