const userDB = {
    user: require('../models/users.json'),
    setUsers: function (data) {
        this.user = data
    }
}
const Roles = require('../models/roles.json');
const fsPromise = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    console.log("Registering New User");
    const {username, password, roles} = req.body;

    const found = userDB.user.find(u => u.username === username);
    if (found)
        return res.status(400).json({"message": "User Already Exist"});

    console.log("Registering New User: " + username);
    if (!username || !password) return res.status(400).json({'message': 'Username or password Missing'});
    const hashedpwd = await bcrypt.hash(password, 10);
    console.log("hashed pass: ->   " + hashedpwd);
    const newUsr = {
            'username': username,
            'password': hashedpwd,
            'roles': roles !== undefined && roles.length !== 0 ? roles : [].concat(Roles.find(u => u.RoleName === 'StandardUser').RoleName)

        }
    ;
    userDB.setUsers([...userDB.user, newUsr]);
    await fsPromise.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(userDB.user)
    );
    res.status(500).json({'success': 'new user created'});
}

module.exports = handleNewUser;