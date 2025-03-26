function filterRequests(req, res, next) {
    if (req.originalUrl === "/favicon.ico" || req.originalUrl === "/getAllNotes") {// icons are static and are already loaded/cached from app.use(express.static("public")), Just as demonstration, if any req like this comes here, we can return from here instead of doing next()
        console.log("Dont need to process this request");
        return;
    }
    next();
}

function logDetails(req, res, next) {
    console.log("req coming from " + req.originalUrl);
    next();
}

function authenticateUser(req, res, next) {
    if (req.query.name === "adarsh") {
        req.user = {name: "adarsh", location: "india"}; // adding User context when authenticated
        console.log("Authenticated");
    } else
        console.log("Wrong User");
    next();
}

module.exports = {logDetails, authenticateUser, filterRequests};