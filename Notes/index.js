const express = require("express");
const app = express();
const router = express.Router();
const notesRouter = require("./routes/notes.js");
const testRouter = require("./routes/testrouter.js");
const {logDetails,authenticateUser,filterRequests} = require("./middleware/middleware.js");

app.listen(3000);
app.set("view engine", "ejs");

//app.use can essentially add all the middleware logic, logging, auth, req manipulation, validation, security etc
app.use(express.static("public"));// This middleware will serve static files from public folder. When the static files are available the call will return from here automatically. Keeping static load before filterRequest middleware because static files will be loaded and returned.
app.use(filterRequests);// filtering req in middleware
app.use(logDetails);// using logging in middleware
app.use(authenticateUser);// using logging in middleware
app.use("/notes", notesRouter);// Routing all /notes request to notesRouter
app.use("/", testRouter);// Routing all / request to testRouter

module.exports = router;