const userDB = {
    user: require('../models/users.json'),
    serUsers: function (data) {
        this.user = data
    }
}
const fsPromise = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({'message': 'No creds given'});
    const hashedpwd = await bcrypt.hash(password, 10);
    console.log("hashed pass: ->   " + hashedpwd);
    const newUsr = {'username': username, 'password': hashedpwd, 'roles': ['Admin']};
    userDB.serUsers([...userDB.user, newUsr]);
    await fsPromise.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(userDB.user)
    );
    res.status(500).json({'success': 'new user created'});

}

module.exports = handleNewUser;