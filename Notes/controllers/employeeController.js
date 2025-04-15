const data = {};
data.employees = require('../models/users.json');

const getAllEmployee = (req, res) => {
    res.json(data.employees);
};

const getEmployeeById = (req, res) => {
    res.json({"id": req.param.id});
};

const addEmployee = (req, res) => {
    res.json(data.employees.push({"id": 3, "name": "tricky"}));
};


module.exports = {getAllEmployee, addEmployee, getEmployeeById}