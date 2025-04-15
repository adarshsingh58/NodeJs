const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const userDB = {
    user: require('../models/users.json'),
    serUsers: function (data) {
        this.user = data
    }
}
const authenticateUser = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password)
        return res.status("501").json({"message": "Creds are missing"});
    const foundUser = userDB.user.find(user => user.username === username);
    if (!foundUser)
        return res.status("402").json({"message": "User not found"});
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //create JWT
        const ***REMOVED*** = jwt.sign(
            {"username": foundUser.username, "roles": foundUser.roles},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '3000s'}
        );

        const ***REMOVED*** = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        res.cookie('jwt', ***REMOVED***, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({***REMOVED***});


    } else
        res.status("402").json({"message": "Password not matching"});
}

module.exports = authenticateUser;