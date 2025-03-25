const express = require("express");
const app = express();
const router = express.Router();
const notesRouter = require("./routes/notes");

app.listen(3000);
app.set("view engine", "ejs");

app.use(express.static("public"));// This middleware will serve static files from public folder.
app.use("/notes", notesRouter);

app.get("/index", (req, res) => {
    res.render(__dirname + "/views/hello");
});

app.get("/clienterror", (req, res) => {
    res.sendStatus(400).send("Wrong Input");
});


module.exports = router;