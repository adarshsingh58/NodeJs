const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const router = express.Router();
const cookieparser = require('cookie-parser');
const notesRouter = require("./routes/notes.js");
const testRouter = require("./routes/testrouter.js");
const empRouter = require("./routes/employee.js");
const registerRouter = require("./routes/registerRoute.js");
const loginRouter = require("./routes/loginAuthRoute.js");
const refreshRouter = require("./routes/***REMOVED***Route.js");
const logoutRouter = require("./routes/logoutRoute.js");
const {logDetails, authenticateUser, filterRequests,verifyJWT} = require("./middleware/middleware.js");

app.set("view engine", "ejs");
app.set("views", __dirname + "views");
app.set("layout", __dirname + "layouts/layout");

app.listen(process.env.PORT || 3000);

//app.use can essentially add all the middleware logic, logging, auth, req manipulation, validation, security etc
//Any .use we do i.e. middleware action we do should be placed properly because any line written after .use will be impacted by whats written in that middleware logic
//For inbuilt middlewares or dependency Middlewares like express.static next() middleware will automatically be called, but when we write a custom middleware like logDetails, we miust use next() at the end of middleware logic.
app.use(expressLayouts);// This middleware will serve static files from public folder. When the static files are available the call will return from here automatically. Keeping static load before filterRequest middleware because static files will be loaded and returned.
app.use(express.json());// Required for parsing JSON in Request Body, without this req.body will always be empty for any call
app.use(express.urlencoded({ extended: true }));// Optional: for parsing URL-encoded form data
app.use(cookieparser());// For parsing Cookies
app.use(express.static(__dirname + "public"));// This middleware will serve static files from public folder. When the static files are available the call will return from here automatically. Keeping static load before filterRequest middleware because static files will be loaded and returned.
app.use(filterRequests);// filtering req in middleware. This is custom Middleware.
app.use(logDetails);// using logging in middleware
app.use(authenticateUser);// using logging in middleware

app.use("/notes", notesRouter);// Routing all /notes request to notesRouter
app.use("/", testRouter);// Routing all / request to testRouter

//Logging in, Registering and Refreshing Access Token must come before verifyJWT, because we dont have/need an access token here.
app.use("/login", loginRouter);// Routing all /login to loginRouter. First time logging this is called and ***REMOVED*** and ***REMOVED*** is generated and passed in response.
app.use("/refresh", refreshRouter);// Routing all /refresh to refreshRouter. This is called when a new access token is needed with a valid refresh token
app.use("/register", registerRouter);// Routing all /register to registerRouter. Registers a User.

//Any operation that needs authentication and authorization must come after verifyJWT
app.use(verifyJWT);// JWT access token verification
app.use("/employees", empRouter);// Routing all /employees to empRouter. This call must be accessed only if jwt ***REMOVED*** is valid
app.use("/logout", logoutRouter);// Routing all /logout to logoutRouter. This call must be accessed only if jwt ***REMOVED*** is valid

module.exports = router;