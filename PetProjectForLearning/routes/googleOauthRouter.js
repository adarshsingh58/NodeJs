const express = require('express');
const passport = require("passport");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("<a href='" + req.baseUrl + "/GoogleAuth'>Login using Google Oauth</a>");
});

/*
* Registration (passport.use): in middleware/googleOauth.js we have code similar to this:
       const GoogleStrategy = require('passport-google-oauth20').Strategy;
       passport.use(new GoogleStrategy({...})); // Registers Google's strategy with passport
    * When you call passport.use() with an instance of GoogleStrategy like this without providing an explicit first argument (a name string),
    * Passport automatically registers this strategy under the default name assigned by the passport-google-oauth20 library, which is 'google'.

* Invocation (passport.authenticate): When you write passport.authenticate('google', ...) in your route handlers:
        You are telling Passport: "For this specific route, I want you to invoke the authentication strategy that was registered under the name 'google'."
        Passport looks up its registered strategies, finds the GoogleStrategy instance associated with the name 'google', and executes its logic.
In the Context of our Routes:
        router.get('/GoogleAuth', passport.authenticate("google", {scope: ["profile", "email"]}));
        * This tells Passport: "When a GET request hits /GoogleAuth, use the 'google' strategy to initiate the authentication flow."
        * The 'google' strategy, when initiating, knows it needs to redirect the user's browser to Google's OAuth 2.0 consent screen.
        * The {scope: ["profile", "email"]} option tells the 'google' strategy to request permission from the user (via Google) to access their basic profile information and email address.

        router.get('/GoogleOauth/callback', passport.authenticate('google', {failureRedirect: '/'}), ...);
        * This tells Passport: "When a GET request hits /GoogleOauth/callback (which is where Google redirects the user back to after they log in), use the 'google' strategy again to handle the callback."
        * The 'google' strategy, when handling the callback, knows how to:
            Extract the authorization code from the URL query parameters.
            Exchange that code with Google for an access token and refresh token.
            Use the access token to fetch the user's profile (matching the requested scope).
            Execute the verify callback function you provided in passport.use (the one with ***REMOVED***, ***REMOVED***, profile, done).
            Handle success or failure.
        * The {failureRedirect: '/'} option tells the 'google' strategy that if any part of the callback handling fails (e.g., user denied access, invalid code, error in your verify callback), the user should be redirected to the / route.
        *
        * 'google' is simply the key that links your route handler's call to passport.authenticate with the specific
        * GoogleStrategy configuration you defined earlier using passport.use.
        * It allows Passport to know which authentication mechanism to employ for that particular request.
* */
router.get('/GoogleAuth', passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: 'offline', // Request refresh token
    prompt: 'consent'       // Force consent screen to re-issue refresh token (useful for testing)
}));

router.get('/GoogleOauth/callback', passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.send("<p>You are now google authenticated</p>").end();
    });

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout(function (err) { // req.logout requires a callback function
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
module.exports = router;