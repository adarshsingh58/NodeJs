const express = require('express')
const router = express.Router();
const handleNewUser = require('../controllers/registerUser')


router.post("/ex",(req,res)=> {

    res.status('500').json({"message":req.body});
});


router.route('/')
    .post(handleNewUser);

module.exports = router;