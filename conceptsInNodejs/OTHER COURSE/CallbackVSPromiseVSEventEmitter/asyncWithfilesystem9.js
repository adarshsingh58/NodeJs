const fs = require("fs").promises;
const path = require("path");

fs.readFile(path.join(".", "hello.txt"), "utf8")
    .then((data) => {
        console.log(data);
        return fs.rename(path.join(".", "hello.txt"), path.join(".", "namaskar.txt"));
    })
    .then(() => {
        console.log("Renaming to namaskar completed");
        return fs.rename(path.join(".", "namaskar.txt"), path.join(".", "hello.txt"));
    })
    .then(() => {
        console.log("Renaming to hello completed");
    })
    .catch((error) => {
        console.log("Some error occurred:", error);
    });

/**
 * So to again avoid callbackhell in promises, we use proper chaining.
 *
 * Why is async/await better?
 *     More readable (looks like synchronous code).
 *     Easier error handling (try...catch).
 *     No nesting at all.
 *
 * Conclusion
 *     Your nested .then() approach works but is hard to maintain ❌.
 *     Promise chaining (.then()) is better if you prefer .then() ✅.
 *     async/await is the best for readability and maintainability ✅✅.
 *
 * 🚀 Final Advice: If possible, use async/await for clean, readable, and maintainable code!
 *
 * */
