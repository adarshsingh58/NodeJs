
/*Alternative Fix: Keep the Promise

If you want to return a Promise, do not use await inside resolvetest():*/
async function resolvetest() {
    console.log("2");
    return new Promise((resolve) => {
        console.log("3");
        resolve("5");
    });
}

async function asyncCall() {
    console.log("1");

    let myPromise = resolvetest();  // ✅ Now myPromise is a Promise

    console.log("4");

    myPromise.then((result) => console.log(result)); // ✅ Works correctly!
}

asyncCall();
