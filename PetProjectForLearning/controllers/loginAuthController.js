const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const {promises: fsPromise} = require("fs");

const userDB = {
    user: require('../models/users.json'),
    setUsers: function (data) {
        this.user = data
    }
}
const authenticateUser = async (req, res) => {
    const {username, password} = req.body;
    console.log(`Loggin for user: ${username}`);
    if (!username || !password)
        return res.status("501").json({"message": "Username or Password Missing"});
    const foundUser = userDB.user.find(user => user.username === username);
    if (!foundUser)
        return res.status("402").json({"message": "User not found"});
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        console.log(`Credentials for user: ${username} matched successfully`);
        //If login details are matching the User then we can proceed with creating JWT Access and Refresh Tokens
        const accessToken = jwt.sign(
            {"username": foundUser.username, "roles": foundUser.roles},// This is the main payload or Claim of the Token
            process.env.ACCESS_TOKEN_SECRET,// This is the access token secret key. Right now it is hardcoded in env file, but in prod we generate it on the fly
            {expiresIn: '180s'}//This has optional details like ttl
        );
        //All 3 components above makes a JWT, Json Web Token. The access Token we get is encrypted string with 2 dots, separating claim/payload, accessSecret and optionalDetails
        console.log(`Access Token for user ${username} is generated: ${accessToken}`);
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '10s'}
        );
        console.log(`Refresh Token for user ${username} is generated: ${refreshToken}`);


        foundUser.refreshToken = refreshToken;

        const otherUserList = userDB.user.filter(user => {
            console.log(user);
            return user.username !== username;

        });
        userDB.setUsers([...otherUserList, foundUser]);
        await fsPromise.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(userDB.user)
        );

        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // we set refreshToken in httpOnly Cookie to avoid CSRF and XSS attach since httpOnly True doesnt allow JS to access the data
        res.json({accessToken});// Access tokens are simply added in response and are short lived in-memory tokens


    } else
        res.status("402").json({"message": "Password not matching"});
}

module.exports = authenticateUser;