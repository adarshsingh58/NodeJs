const express = require('express')
const router = express.Router();
const empController = require('../controllers/employeeController')
const {authorizationWithRoles} = require('../middleware/middleware')

router.route('/')
    .get(empController.getAllEmployee)
    .post(authorizationWithRoles("Editor","Admin"), empController.addEmployee);

router.route('/:id')
    .get(empController.getEmployeeById);

module.exports = router;