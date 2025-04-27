// lib/userDb.js
const fse = require('fs-extra');
const path = require('path');

// Resolve the absolute path to the database file based on the .env variable
const DB_PATH = path.resolve(process.env.USER_DB_PATH || './models/users.json');

// Helper function to read users from the file
async function readUsers() {
    try {
        // Ensure the file exists, creating an empty object if it doesn't
        await fse.ensureFile(DB_PATH);
        const data = await fse.readFile(DB_PATH, 'utf8');
        const x = JSON.parse(data);
        return data ? JSON.parse(data) : {}; // Return empty object if file is empty
    } catch (err) {
        console.error("Error reading user DB:", err);
        return {}; // Return empty object on error to avoid crashing
    }
}

// Helper function to write users to the file
async function writeUsers(users) {
    try {
        await fse.writeJson(DB_PATH, users, {spaces: 2}); // Write formatted JSON
    } catch (err) {
        console.error("Error writing user DB:", err);// In a real app, you might want more robust error handling here
    }
}

// Function to find a user by their Google ID
async function findUserById(googleId) {
    console.log(">>> ENTERING Google Strategy Verify Callback"); // Add log
    try {
        const users = await readUsers();
        return users[googleId] || null; // Return user or null if not found
    } catch (err) {
        console.error("Failure in findUserById"); // Add log
        throw err;
    }
}

// Function to find or create a user based on Google profile
async function findOrCreateUser(profile, accessToken, refreshToken) {
    try {
        const users = await readUsers();
        const googleId = profile.id;

        let user = users.find(u => u.googleId === googleId);

        if (user) {
            // User exists, update tokens and potentially other details
            console.log(`User ${googleId} found. Updating details.`);
            user.displayName = profile.displayName;
            user.email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : user.email; // Update email if available
            user.photo = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : user.photo; // Update photo if available
            user.accessToken = accessToken; // Always update access token
            // IMPORTANT: Only update refresh token if a new one is provided
            // Google often only sends it on the first authorization
            if (refreshToken) {
                user.refreshToken = refreshToken;
            }
            user.lastLogin = new Date().toISOString();
        } else {
            // User doesn't exist, create new entry
            console.log(`User ${googleId} not found. Creating new user.`);
            user = {
                googleId: googleId,
                displayName: profile.displayName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
                accessToken: accessToken, // Is it a good idea to store access token?
                refreshToken: refreshToken, // Store the initial refresh token
                roles: ["StandardUser"],
                username: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                authSource: "GoogleOauth",
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            };
            /*Update the users object and write back to file. Only when a new user is cretead we are pushing
            * Since user object, if found, is pass by reference, will anyways be updated inside the users array.
            * */
            users.push(user);
        }
        await writeUsers(users);
        return user; // Return the found or newly created user object
    } catch (err) {
        console.error("Failure in findOrCreateUser"); // Add log
        throw err;
    }
}

module.exports = {
    findUserById,
    findOrCreateUser
};