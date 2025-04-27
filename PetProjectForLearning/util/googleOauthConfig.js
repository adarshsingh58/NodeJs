const GoogleStrategy = require('passport-google-oauth20').Strategy; // Corrected variable name
const {findUserById, findOrCreateUser} = require('../models/Users'); // Import our DB functions
/*
* let's break down what this specific piece of code using passport.use(new GoogleStrategy(...)) does step-by-step:
*     passport.use(...):
*               This is the core function in Passport.js used to register an authentication strategy.
*               You're telling Passport, "Here is a way users can log in or authenticate."
*     new GoogleStrategy(...):
*               You are creating an instance of the Google OAuth 2.0 authentication strategy, provided by the passport-google-oauth20 library.
*               This strategy knows how to handle the complex redirects and token exchanges involved in the Google login flow.
*     Configuration Object ({ ***REMOVED***, ***REMOVED***, callbackURL }): This first argument provides the essential configuration details needed for the strategy to communicate with Google:
*               ***REMOVED***: process.env.***REMOVED***: This is your application's unique public identifier, obtained from the Google Cloud Console when you set up OAuth credentials. It tells Google which application is requesting authentication. It's being loaded securely from an environment variable.
*               ***REMOVED***: process.env.GOOGLE_OAUTH_CLIENT_SECRET: This is a secret key known only to your application and Google, also obtained from the Google Cloud Console. It's used to verify your application's identity when exchanging codes for tokens. It's also loaded securely from an environment variable.
*               callbackURL: process.env.GOOGLE_OAUTH_CALLBACK: This is a crucial URL within your own application where Google will redirect the user's browser after they have successfully authenticated (or denied permission) on Google's sign-in page. Your server needs to have a route defined to handle requests to this URL (this is where passport.authenticate('google', ...) is typically used again in the route handler). This URL must exactly match one of the "Authorized redirect URIs" you configured in the Google Cloud Console. It's also loaded from an environment variable.
*     Verify Callback Function ((***REMOVED***, ***REMOVED***, profile, done) => { ... }): This second argument is the most important part for your application logic.
*               This function is executed after the user has successfully authenticated with Google and Google has redirected them back to your callbackURL.
*               The passport-google-oauth20 strategy automatically handles:
*                   Receiving the authorization code from Google in the callback request.
*                   Exchanging that code (along with your ***REMOVED*** and ***REMOVED***) with Google for an ***REMOVED*** and potentially a ***REMOVED***.
*                   Using the ***REMOVED*** to request the user's profile information from Google.
*               Then, it calls this function, passing in the results:
*               ***REMOVED***: A short-lived token granted by Google. Your application could use this token to make authorized API calls to Google APIs on behalf of the user (e.g., read calendar events, access contacts, depending on the requested scope). Often, for simple login, you don't need to store or use this token directly yourself.
*               ***REMOVED***: A longer-lived token (if requested and granted by Google - depends on access_type=offline and user consent) that can be used to obtain new ***REMOVED***s without requiring the user to log in again. This is crucial for background access but needs to be stored very securely. Note: The code snippet provided incorrectly logs ***REMOVED*** twice; the second log should likely be ***REMOVED***.
*               profile: An object containing the user's profile information retrieved from Google (e.g., Google ID, display name, email addresses, photos). The exact content depends on the scope requested during the authentication initiation.
*               done: This is a callback function supplied by Passport. You must call this function to indicate the outcome of your verification step.
*                 done(null, user): Call this if you have successfully identified or created a user in your system based on the Google profile. The user object you pass here will be attached to the request as req.user and typically serialized into the session by Passport.
*                 done(err): Call this if an error occurred during your verification process (e.g., database connection failed).
*                 done(null, false): Call this if authentication failed for a reason specific to your application (e.g., you found the Google user but decided not to let them log in based on some criteria).
* */
module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            "***REMOVED***": process.env.***REMOVED***,
            "***REMOVED***": process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            "callbackURL": process.env.GOOGLE_OAUTH_CALLBACK // Use absolute path, ensure it matches Google Console Redirect URI
        }, async (***REMOVED***, ***REMOVED***, profile, done) => {
            // --- User Find/Create Logic ---    This function is called after successful Google authentication
            // In a real app, you would typically find or create a user in your database here based on the profile.id or profile.emails[0].value For this example, we just pass the Google profile directly.
            console.log(" Google Strategy Verify Callback Fired:");
            console.log(" Google Oauth Access Token:", ***REMOVED*** ? "[REDACTED]" : "N/A"); // Avoid logging sensitive tokens directly
            console.log(" Google Oauth Refresh Token:", ***REMOVED*** ? "[REDACTED]" : "N/A");
            console.log(" Google Oauth Profile ID:", profile.id);
            console.log(" Google Oauth Profile Name:", profile.displayName);

            try {
                // Use our function to find or create the user in the "database" (file)
                const user = await findOrCreateUser(profile, ***REMOVED***, ***REMOVED***);
                if (user) {// Pass the application's user object (from our file) to Passport
                    return done(null, user); // Pass the application's user object (from our file) to Passport
                } else {
                    return done(null, false, {message: 'Could not find or create user.'});// Should not happen with findOrCreate, but handle defensively
                }
            } catch (err) {
                console.error("Error during user find/create:", err);
                return done(err, false); // Pass error to Passport
            }
        }
    ));

    // --- Session Management ---

    // Determines what data from the user object should be stored in the session. Typically, just the user ID is enough. Here Stores the user's unique ID (googleId) in the session.
    passport.serializeUser((user, done) => {
        //you do `done(null, user.id);` after finding/creating the user. Storing the whole profile, like done(null, profile); can make the session cookie large.
        console.log(`Serialize User: Storing googleId ${user.googleId} in session.`);
        // Store only the unique identifier from our user object
        done(null, user.googleId);
    });


    // Retrieves the full user object from the "database" using the ID stored in the session
    passport.deserializeUser(async (id, done) => {
        console.log(`Deserialize User: Looking up user with googleId ${id}`);
        try {
            const user = await findUserById(id);// Use the ID (googleId) to find the user in our "database"
            if (user) {
                done(null, user); // Attach the full user object to req.user
            } else {
                done(null, false); // User not found in our DB
            }
        } catch (err) {
            console.error("Error during user deserialization:", err);
            done(err, false);
        }
    });
};
