const express = require('express')
const router = express.Router();
const registerUser = require('../controllers/registerUser')

router.route('/')
    .post(registerUser);

module.exports = router;