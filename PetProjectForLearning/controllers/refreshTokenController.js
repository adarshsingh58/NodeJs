const jwt = require('jsonwebtoken');
const {decode} = require("jsonwebtoken");
require('dotenv').config();

const userDB = {
    user: require('../models/users.json'),
    setUsers: function (data) {
        this.user = data
    }
}
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        console.log(`No JWT Refresh Token Set in Cookie`);
        return res.status(401).json({"message": "No JWT Refresh Token Set in Cookie"});
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = userDB.user.find(user => user.refreshToken === refreshToken);
    if (!foundUser) {
        console.log(`No user with refresh Token ${refreshToken}`);
        return res.status(403).json({"message": "No user with this refresh Token"});
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decode) => {
            if (err || foundUser.username !== decode.username) {
                console.log(`User from Request refreshToken '${decode.username}' not Matching with associated user from DB '${foundUser.username}'`);
                return res.status(403).json({"message": "User from Request refreshToken not Matching with associated user from DB"});
            }
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