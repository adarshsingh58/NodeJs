const GoogleStrategy = require('passport-google-oauth20').Strategy; // Corrected variable name

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            "***REMOVED***": "464270615159-fnv9bt0gum38cch1sl1fof4rpd6fe67d.apps.googleusercontent.com",
            "***REMOVED***": "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",
            "callbackURL": "/oAuth/GoogleOauth/callback" // Use absolute path, ensure it matches Google Console Redirect URI Or use an env variable: callbackURL: process.env.GOOGLE_CALLBACK_URL
        }, (***REMOVED***, ***REMOVED***, profile, done) => {
            // --- User Find/Create Logic ---
            // In a real app, you would typically find or create a user
            // in your database here based on the profile.id or profile.emails[0].value
            // For this example, we just pass the Google profile directly.
            console.log("Google Strategy Callback Fired:");
            // console.log("Access Token:", ***REMOVED***); // Careful logging tokens
            // console.log("Profile:", profile);
            return done(null, profile); // Pass the profile data to serializeUser
        }
    ));
    // Determines what data from the user object should be stored in the session.
    // Typically, just the user ID is enough.
    passport.serializeUser((user, done) => {
        // In a real app, you might do `done(null, user.id);` after finding/creating the user.
        // Storing the whole profile can make the session cookie large.
        console.log("Serializing user:", user.displayName || user.id);
        done(null, user); // For simplicity now, store the whole user profile object
    });

    // Retrieves the user data from the session using the key stored (e.g., user ID).
    passport.deserializeUser((obj, done) => {
        // In a real app, you'd use the id stored by serializeUser to find the user
        // in your database: User.findById(id).then(user => done(null, user));
        console.log("Deserializing user:", obj.displayName || obj.id);
        // For now, since we stored the whole object, we just pass it back.
        done(null, obj);
    });


};