const express = require("express");
const router = express.Router();

router.get("/index", (req, res) => {
    res.render(__dirname + "/views/hello");
});

router.get("/clienterror", (req, res) => {
    res.sendStatus(400).send("Wrong Input");
});

module.exports = router;