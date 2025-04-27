// You observe that these are Custom Middleware, so we must use next() function in order for Node to call next middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();

function filterRequests(req, res, next) {
    if (req.originalUrl === "/favicon.ico" || req.originalUrl === "/getAllNotes") {// icons are static and are already loaded/cached from app.use(express.static("public")), Just as demonstration, if any req like this comes here, we can return from here instead of doing next()
        console.log("Dont need to process this request");
        return;
    }
    next();
}

function logDetails(req, res, next) {
    console.log("req coming from " + req.originalUrl);
    console.log("req method Type " + req.method);
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

function verifyJWT(req, res, next) {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    //verify the access Token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decode) => {
            if (err) {
                console.log(`Access Token Invalid`);
                return res.status(403).json({"message": err.message});
            }
            req.username = decode.username;
            req.roles = decode.roles;
            next()
        }
    )
}

const authorizationWithRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.username) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        if (req.roles.map(role => rolesArray.includes(role)).find(val => val === true)) {
            next();
        } else {
            console.log(`User ${req.username} not Authorized for ${req.originalUrl}`);
            return res.status(401).json({"message": `User ${req.username} not Authorized for ${req.originalUrl}`});
        }
    }
}


module.exports = {logDetails, authenticateUser, filterRequests, verifyJWT, authorizationWithRoles};