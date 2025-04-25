const express = require('express')
const router = express.Router();
const handleRefreshToken = require('../controllers/***REMOVED***Controller');


router.route('/')
    .post(handleRefreshToken);


module.exports = router;