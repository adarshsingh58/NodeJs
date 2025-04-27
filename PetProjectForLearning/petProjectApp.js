/*
* Load environment variables VERY FIRST.
* We don't need dotenv anywhere else if it's loaded early in main app.js ->
* It's generally best practice to load dotenv ONCE at the very beginning of your main application file (app.js).
* The process.env variables will then be available globally.
* It is important to load it before doing require on other modules. If not done before, then if in those modules you are
* using env reference assuming that it has already been defined in app.js then that wont work.
*
* In these cases, where dotenv require is done post require of other modules, make sure dotenv is imported in
* those modules explicitly
* */
require('dotenv').config();
const path = require("path");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieparser = require('cookie-parser');
const constant = require('./util/appConstants.js');// dont use util/appconstants because node will then check in core util folder first which would give error
const promClient = require("prom-client");

//                                               --- Import Routers ---
const notesRouter = require("./routes/notes.js");
const testRouter = require("./routes/testrouter.js");
const booksCatalogueRouter = require("./routes/booksCatalogueRouter");
const registerRouter = require("./routes/registerRoute.js");
const loginRouter = require("./routes/loginAuthRoute.js");
const refreshRouter = require("./routes/refreshTokenRoute.js");
const logoutRouter = require("./routes/logoutRoute.js");
const audioRouter = require("./routes/audioRoute.js");

const googleOauthRouter = require("./routes/googleOauthRouter.js");
//                                               --- Import Middleware ---
const {logDetails, authenticateUser, blockUnwantedRequests, verifyJWT} = require("./middleware/middleware.js");
const passport = require('passport');
const expressSession = require('express-session');

const {limiter: rateLimiterExpress, rateLimiterMiddleware: rateLimiterRedis} = require("./middleware/rateLimitter");

//                                               --- Middleware & Setup ---
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", __dirname + "/layouts/layout");

//                                               --- Prometheus Configuration---
//Automatic metrics collection: Configure automatic collection of default metrics using collectDefaultMetrics. This includes system metrics such as CPU and memory usage, nodejs_heap_size_total_bytes, nodejs_heap_size_used_bytes: Details about the V8 heap usage. Here we have registered "System Level Default Metrics" with Prometheus, which now it will track automatically.
promClient.collectDefaultMetrics();
/*
Creating a Custom Metric: Any Metric which we want to track specifically needs to be created and registered.
Here a counter called “http_requests_home_page_total” is created. This counter will track the total number of HTTP requests,
and has additional labels for the request method (GET, POST, etc.), status code which will also be logged by prometheus.
By Doing .Counter we have registered this Custom Metric with prometheus.
Now we need to make sure this metric is updated properly for prometheus to log and track.
*/
const requestCounter = new promClient.Counter({
    name: "http_requests_home_page_total",
    help: "Total number of HTTP requests at Home Page",
    labelNames: ["method", "status_code"],
});
// Here we are updating http_requests_home_page_total. So when "/" API is hit we are increasing the counter, that way we know how many total req came for Home Page
// To this for all request we can add this to a middleware.
app.get("/", (req, res) => {
    requestCounter.inc({method: req.method, status_code: res.statusCode});
    res.send("Welcome to My Pet Project");
});
/*  promClient.collectDefaultMetrics() and new promClient.Counter() register metrics and provide ways to update their values within your running
    Node.js application's memory. The promClient library manages an internal registry of these metrics and their current states.
    Prometheus itself runs as a separate process (often on a different machine or container).
    It needs a way to ask your application for the current values of those metrics.
    The Role of the /metrics Endpoint:
    This endpoint acts as the standardized location where your application makes its collected metrics available for Prometheus to scrape.
    When Prometheus scrapes http://yourapp:3002/metrics, your route handler (app.get("/metrics", ...)) executes.
    Inside that handler, await promClient.register.metrics() does the crucial work:
        It gathers the current values of all metrics registered with promClient (both default and custom).
        It formats this data into the Prometheus text exposition format, which is a specific plain text format that Prometheus understands.
    Your handler then sends this formatted text back as the HTTP response.
    Prometheus receives this text response, parses it, and stores the metrics in its time-series database.
*/
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
});


//                                               --- Session Configuration For Oauth---
// Use the secret from .env
if (!process.env.SESSION_SECRET) {
    console.error("FATAL ERROR: SESSION_SECRET is not defined in .env file.");
    process.exit(1); // Exit if session secret is missing
}
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false, // Standard practice
    saveUninitialized: false, // Standard practice - don't save session if unmodified. resave: false, Don't create session until something stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Example: 1 day session lifetime // secure: process.env.NODE_ENV === 'production',Use secure cookies in production (requires HTTPS)
    }
    // Consider adding a session store for production (like connect-mongo, connect-redis)
}));
// --- Passport Initialization ---
// Initialize passport BEFORE using the router that relies on it
app.use(passport.initialize());
app.use(passport.session()); // Allow persistent login sessions.  Link Passport with Express session
// --- Configure Passport Strategies (using the decoupled file) ---
// Require the setup function and immediately call it, passing the passport instance
require('./util/googleOauthConfig')(passport); // Adjust path if needed
// --- END : Session Configuration For Oauth---

//app.use can essentially add all the middleware logic, logging, auth, req manipulation, validation, security etc
//Any .use we do i.e. middleware action we do should be placed properly because any line written after .use will be impacted by what is written in that middleware logic
//For inbuilt middlewares or dependency Middlewares like express.static next() middleware will automatically be called, but when we write a custom middleware like logDetails, we miust use next() at the end of middleware logic.
app.use(expressLayouts);// This middleware will serve static files from public folder. When the static files are available the call will return from here automatically. Keeping static load before filterRequest middleware because static files will be loaded and returned.
app.use(express.json());// Required for parsing JSON in Request Body, without this req.body will always be empty for any call
app.use(express.urlencoded({extended: true}));// Optional: for parsing URL-encoded form data
app.use(cookieparser());// For parsing Cookies

/*
* express.static Middleware:
* This middleware will serve static files from public folder. When the static files are available the call will return from here automatically.
* Keeping static load before filterRequest middleware because static files will be loaded and returned.
* Make sure this is loaded before any Oauth or JWT call, since we don't need any authentication to serve static files like favicon.ico
* You almost certainly have this line in your app.js (or equivalent setup file) before the code that mounts the router handling the / path:
    app.use(express.static(path.join(__dirname, "public")));
    Default Index File Serving:
    * The express.static middleware has a built-in feature: when a request comes in for a directory path (like the root /),
    *  it checks if a default index file (usually index.html) exists within the corresponding directory in your static folder (public/ in this case).
    Order of Operations:
    * A request arrives for /.
    * The request hits app.use(express.static(path.join(__dirname, "public"))); first.
    * express.static sees the request is for / and looks for public/index.html.
    * It finds public/index.html.
    * It serves the content of public/index.html and ends the request-response cycle.
    * Route Handler Never Reached: Because express.static already handled the request and ended it, the request never reaches the point where your specific router for / is processed, and therefore your router.get("/", ...) handler is never executed.
* Hence if the static content is served before "/" api will not be served. If you Try the "localhost:3000/" right now instead of sending "Welcome to My Pet Project" Text, it serves the index.html
* from public folder.
*
* To Avoid this:
* You need to ensure your specific route handler for / runs before express.static gets a chance to serve index.html for that path.
* */
app.use(express.static(path.join(__dirname, "/", "public")));

//Adding Rate Limiter after express static, so that static data is still servable to client
if (process.env.RATE_LIMITER === constant.REDIS) {
    app.use(rateLimiterRedis);
} else if (process.env.RATE_LIMITER === constant.EXPRESS_LIMITER) {
    app.use(rateLimiterExpress);
}

//                                               --- Custom Middleware Invoking ---
app.use(blockUnwantedRequests);// filtering req in middleware. This is custom Middleware. If we keep this call before express.static then /favicon.ico call will reach to blockUnwantedRequests middleware
app.use(logDetails);// using logging in middleware

// --- PUBLIC ROUTES (No JWT Required) --- Mount routers that anyone can access before the JWT check
app.use("/", testRouter);// Routing all / request to testRouter
//Logging in, Registering and Refreshing Access Token must come before verifyJWT, because we dont have/need an access token here.
app.use("/register", registerRouter);// Routing all /register to registerRouter. Registers a User.
app.use("/login", loginRouter);// Routing all /login to loginRouter. First time logging this is called and accessToken and refreshToken is generated and passed in response.
app.use("/refresh", refreshRouter);// Routing all /refresh to refreshRouter. This is called when a new access token is needed with a valid refresh token
app.use("/oAuth", googleOauthRouter);// This Google Oauth Router should be before JWT one, else for oauth as well, we need  JWT access token which is not ideal. Also make sure the callBackUrl in GoogleCloud and in code is same

//                                               --- JWT AUTHENTICATION MIDDLEWARE ---
// Any route defined *after* this line will require a valid JWT. Any operation that needs authentication and authorization must come after verifyJWT
app.use(verifyJWT);// JWT access token verification

//                                               --- PROTECTED ROUTES (JWT Required) --- These routes will only be accessible if jwtAuthenticateUser calls next() successfully

app.use("/notes", notesRouter);// Routing all /notes request to notesRouter
app.use("/books", booksCatalogueRouter);// Routing all /employees to empRouter. This call must be accessed only if jwt accessToken is valid
app.use("/logout", logoutRouter);// Routing all /logout to logoutRouter. This call must be accessed only if jwt accessToken is valid
app.use('/audio', audioRouter);// using this route before rate limiting and auth. That way anyone can access  audio get

//                                               --- Start Server ---
app.listen(process.env.NODE_APP_PORT || 3000);