const jwt = require('jsonwebtoken');
const {decode} = require("jsonwebtoken");
require('dotenv').config();

const userDB = {
    user: require('../models/users.json'),
    serUsers: function (data) {
        this.user = data
    }
}
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookie;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const ***REMOVED*** = cookies.jwt;

    const foundUser = userDB.user.find(user => user.***REMOVED*** === ***REMOVED***);
    if (!foundUser) res.sendStatus(403);

    jwt.verify(
        ***REMOVED***,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decode) => {
            if (err || foundUser.username !== decode.username) return res.sendStatus(403);
            const newAccessToken = jwt.sign(
                {"username": decode.username, "roles": decode.roles},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({newAccessToken});
        }
    );

}

module.exports = handleRefreshToken;