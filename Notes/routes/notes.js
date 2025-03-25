const express = require("express")

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to Notes!")
});

//keep /create before /:id else ok create will be misconstruted id
router.get("/create", (req, res) => {
    res.send("Lets create some Notes!")
});

router.route("/:id")
    .get((req, res) => {
        let noteId = req.params.id;
        res.send("Fetching Note Number " + noteId);
    })
    .put((req, res) => {
        let noteId = req.params.id;
        res.send("creating Note with Number " + noteId);
    })
    .delete((req, res) => {
        let noteId = req.params.id;
        res.send("deleting Note with Number " + noteId);
    });

module.exports = router;