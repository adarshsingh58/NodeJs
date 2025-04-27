const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/hello", (req, res) => {
    res.render("hello");
});

router.get("/clienterror", (req, res) => {
    res.status(400).send("Wrong Input");
});

module.exports = router;