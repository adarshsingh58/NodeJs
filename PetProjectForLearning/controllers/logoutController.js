const fsPromise = require('fs').promises;
const path = require('path');

const userDB = {
    user: require('../models/users.json'),
    serUsers: function (data) {
        this.user = data
    }
}
const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    console.log(cookies.jwt);
    const ***REMOVED*** = cookies.jwt;

    const foundUser = userDB.user.find(user => user.***REMOVED*** === ***REMOVED***);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true});
        res.sendStatus(204);
    }

    //delete info in DB
    const otherUsers = userDB.user.filter(user => user.***REMOVED*** !== foundUser.***REMOVED***);
    const currentUser = {...foundUser, ***REMOVED***: ""};
    userDB.serUsers([...otherUsers, currentUser]);
    await fsPromise.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(userDB.user)
    );
    res.clearCookie('jwt', {httpOnly: "true"});
    res.sendStatus(204);
}

module.exports = handleLogout;