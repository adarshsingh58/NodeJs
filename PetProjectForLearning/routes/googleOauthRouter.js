const path = require("path");
const fs = require("fs");
const express = require('express');
const passport = require("passport");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("<a href='" + req.baseUrl + "/GoogleAuth'>Login using Google Oauth</a>");
});


router.get('/GoogleAuth', passport.authenticate("google", {scope: ["profile", "email"]}));

router.get('/GoogleOauth/callback', passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.send("<p>You are now google authenticated</p>");
    });

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout(function (err) { // req.logout requires a callback function
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
module.exports = router;