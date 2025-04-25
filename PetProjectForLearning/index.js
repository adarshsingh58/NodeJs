const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieparser = require('cookie-parser');

                                                    // --- Import Routers ---
const notesRouter = require("./routes/notes.js");
const testRouter = require("./routes/testrouter.js");
const booksCatalogueRouter = require("./routes/booksCatalogueRouter");
const registerRouter = require("./routes/registerRoute.js");
const loginRouter = require("./routes/loginAuthRoute.js");
const refreshRouter = require("./routes/***REMOVED***Route.js");
const logoutRouter = require("./routes/logoutRoute.js");
const audioRouter = require("./routes/audioRoute.js");
const googleOauthRouter = require("./routes/googleOauthRouter.js");

                                                    // --- Import Middleware ---
const {logDetails, authenticateUser, filterRequests, verifyJWT} = require("./middleware/middleware.js");
const passport = require('passport');
const expressSession = require('express-session');
const {limiter: rateLimiterExpress, rateLimiterMiddleware: rateLimiterRedis} = require("./middleware/rateLimitter");

require('dotenv').config(); // Load environment variables VERY FIRST.  We don't need dotenv anywhere else if it's loaded early in main app.js ->  It's generally best practice to load dotenv ONCE at the very beginning of your main application file (app.js). The process.env variables will then be available globally.


                                                    // --- Middleware & Setup ---
app.set("view engine", "ejs");
app.set("views", __dirname + "views");
app.set("layout", __dirname + "layouts/layout");

// --- Session Configuration For Oauth---
// Use the secret from .env
app.use(expressSession({
    secret: process.env.***REMOVED***,
    resave: false, // Standard practice
    saveUninitialized: false // Standard practice - don't save session if unmodified
    // Consider adding a session store for production (like connect-mongo, connect-redis)
}));
// --- Passport Initialization ---
// Initialize passport BEFORE using the router that relies on it
app.use(passport.initialize());
app.use(passport.session()); // Allow persistent login sessions
// --- Configure Passport Strategies (using the decoupled file) ---
// Require the setup function and immediately call it, passing the passport instance
require('./middleware/googleOauth')(passport); // Adjust path if needed
// --- END : Session Configuration For Oauth---

// app.use(rateLimiterExpress);// Apply rate limiter to all routes
app.use(rateLimiterRedis);
//app.use can essentially add all the middleware logic, logging, auth, req manipulation, validation, security etc
//Any .use we do i.e. middleware action we do should be placed properly because any line written after .use will be impacted by whats written in that middleware logic
//For inbuilt middlewares or dependency Middlewares like express.static next() middleware will automatically be called, but when we write a custom middleware like logDetails, we miust use next() at the end of middleware logic.
app.use(expressLayouts);// This middleware will serve static files from public folder. When the static files are available the call will return from here automatically. Keeping static load before filterRequest middleware because static files will be loaded and returned.
app.use(express.json());// Required for parsing JSON in Request Body, without this req.body will always be empty for any call
app.use(express.urlencoded({extended: true}));// Optional: for parsing URL-encoded form data
app.use(cookieparser());// For parsing Cookies
app.use(express.static(__dirname + "public"));// This middleware will serve static files from public folder. When the static files are available the call will return from here automatically. Keeping static load before filterRequest middleware because static files will be loaded and returned.
app.use(filterRequests);// filtering req in middleware. This is custom Middleware.
app.use(logDetails);// using logging in middleware
app.use(authenticateUser);// using logging in middleware

                                                    // --- PUBLIC ROUTES (No JWT Required) --- Mount routers that anyone can access before the JWT check
app.use("/", testRouter);// Routing all / request to testRouter
//Logging in, Registering and Refreshing Access Token must come before verifyJWT, because we dont have/need an access token here.
app.use("/register", registerRouter);// Routing all /register to registerRouter. Registers a User.
app.use("/login", loginRouter);// Routing all /login to loginRouter. First time logging this is called and ***REMOVED*** and ***REMOVED*** is generated and passed in response.
app.use("/refresh", refreshRouter);// Routing all /refresh to refreshRouter. This is called when a new access token is needed with a valid refresh token
app.use("/oAuth", googleOauthRouter);// This Google Oauth Router should be before JWT one, else for oauth as well, we need  JWT access token which is not ideal. Also make sure the callBackUrl in GoogleCloud and in code is same
app.use("/notes", notesRouter);// Routing all /notes request to notesRouter

                                                    // --- JWT AUTHENTICATION MIDDLEWARE ---
// Any route defined *after* this line will require a valid JWT. Any operation that needs authentication and authorization must come after verifyJWT
app.use(verifyJWT);// JWT access token verification

                                                    // --- PROTECTED ROUTES (JWT Required) --- These routes will only be accessible if jwtAuthenticateUser calls next() successfully
app.use("/books", booksCatalogueRouter);// Routing all /employees to empRouter. This call must be accessed only if jwt ***REMOVED*** is valid
app.use("/logout", logoutRouter);// Routing all /logout to logoutRouter. This call must be accessed only if jwt ***REMOVED*** is valid
app.use('/audio', audioRouter);// using this route before rate limiting and auth. That way anyone can access  audio get

// --- Start Server ---
app.listen(process.env.PORT || 3000);