const express = require("express")
const db = require("../util/h2DBConnection.js")
const router = express.Router();
const noteModel = require("../models/note.model.js")
router.get("/", (req, res) => {
    res.send("Welcome to Notes!")
});

//keep /create before /:id else ok create will be misconstrued id
router.get("/create", (req, res) => {
    res.send("Lets create some Notes!")
});

db().then(() => {
    router.route("/:id")
        .get((req, res) => {
            let noteId = req.params.id;
            let noteName = req.query.name;
            // console.log(noteId + " " + noteName)
            const note = new noteModel({
                noteName: "MyNewNote"
            });
            note.save();
            noteModel.find({}).then(data => {
                res.send(data)
            });
            // res.send("Fetching Note Number " + noteId);
        })
        .put((req, res) => {
            let noteId = req.params.id;
            res.send("creating Note with Number " + noteId);
        })
        .delete((req, res) => {
            let noteId = req.params.id;
            res.send("deleting Note with Number " + noteId);
        });
});


module.exports = router;