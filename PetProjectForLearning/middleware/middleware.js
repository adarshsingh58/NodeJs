// You observe that these are Custom Middleware, so we must use next() function in order for Node to call next middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();

function blockUnwantedRequests(req, res, next) {
    /* Browsers often request this; static middleware or cache usually handles it.
     * Sending a 204 No Content is a common way to explicitly stop it here if needed.
     *
     * THIS WILL NEVER BE REACHED SINCE WE HAVE SPECIFIED app.use(express.static(path.join(__dirname, "/", "public")));
     * IN OUR MAIN app.js FILE. THAT MEANS CALL WILL FIRST REACH TO EXPRESS STATIC WHICH WILL AUTOMATICALLY SERVE FAVICON.ICO
     * FROM PUBLIC FOLDER IF FOUND.
     *
     * IF WE WANT THIS CALL TO HAPPEN, WE WOULD NEED TO CALL
     * app.use(blockUnwantedRequests);
     * BEFORE EXPRESS.STATIC CALL.
     *
     * */
    if (req.originalUrl === "/favicon.ico") {
        console.log("Dont need to process this request");
        /*
        * Methods that Implicitly Call .end(): Most standard Express response methods are designed to send the response and signal its completion.
        * These methods automatically call res.end() internally for you:
            res.send(body): Sends the response body (string, Buffer, object, array).
            res.json(body): Sends a JSON response.
            res.jsonp(body): Sends a JSONP response.
            res.render(view, locals, callback): Renders a view template and sends the HTML.
            res.redirect(statusOrUrl, url): Redirects the client.
            res.sendStatus(statusCode): Sets the status code and sends the standard text representation as the body (e.g., sends "Not Found" for 404).
            res.sendFile(path, options, callback): Sends a file.
            res.download(path, filename, options, callback): Prompts the client to download a file.
        * If you use any of these methods, you should not call res.end() afterwards. The response is already finished. Calling res.end() again might lead to errors like "Error: Can't set headers after they are sent.".
        *
        * When You Do Need .end(): After res.status(statusCode):
            The res.status(code) method only sets the HTTP status code. It does not send the response or end it.
            If you want to send only a status code with no body (common for responses like 204 No Content, 401 Unauthorized, 403 Forbidden, 404 Not Found
            where you don't need a custom message), you chain .end() after res.status().
         */
        return res.status(204).end();// No Content
    }

    if (req.originalUrl === "/rubbishAPI") {
        console.log("Dont need to process this request");
        /* In Express middleware, you have three main options to proceed:
        Call next(): Pass control to the next middleware function or route handler in the stack.
        Send a Response: End the request-response cycle by sending data back to the client using res.send(), res.json(), res.render(), res.sendStatus(), res.end(), etc.
        Call next(err): Pass an error to the Express error handler.
        When the req.originalUrl is /getAllNotes, your code hits the if block, logs the message, and then executes return;. This exits the filterRequests function, but it doesn't do any of the three required actions.
        It doesn't call next(), so no subsequent middleware or route handler gets called.
        It doesn't send a response using res, so the client is left waiting indefinitely.*/
        // return; Cant do return for above reason

        return res.send("THIS CALL IS NOT CATERED");
    }
    next();
}

function logDetails(req, res, next) {
    console.log(`req coming from ${req.originalUrl} and req method Type ${req.method}`);
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


module.exports = {logDetails, blockUnwantedRequests, verifyJWT, authorizationWithRoles};