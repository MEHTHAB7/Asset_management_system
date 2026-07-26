const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Employee, Branch } = require('../models');

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.status === 'active') {
      where.isActive = true;
    } else if (req.query.status === 'inactive') {
      where.isActive = false;
    }
    if (req.query.search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${req.query.search}%` } },
        { lastName: { [Op.iLike]: `%${req.query.search}%` } },
        { employeeCode: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }
    const employees = await Employee.findAll({ where });
    res.render('employees/index', { employees, query: req.query });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/new', async (req, res) => {
  try {
  const branches = await Branch.findAll();
  res.render('employees/new', { branches });
} catch (err) {
  res.status(500).json({ error: err.message });
}
});

router.post('/', async (req, res) => {
  try {
    const { employeeCode, firstName, lastName, email, phone, department, designation, isActive, dateOfJoining, dateOfLeaving, branchId } = req.body;
    const employee = await Employee.create({
      employeeCode,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      isActive,
      dateOfJoining,
      dateOfLeaving,
      branchId
    });
    res.redirect('/employees');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/edit', async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);
    const branches=await Branch.findAll();
    if(!employee){
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.render('employees/edit', { employee, branches });
    
  });

router.put('/:id', async (req, res) => {
    try{
    const employee = await Employee.findByPk(req.params.id);
   if(!employee){
      return res.status(404).json({ error: 'Employee not found' });
    }
    const { employeeCode, firstName, lastName, email, phone, department, designation, isActive, dateOfJoining, dateOfLeaving, branchId } = req.body;

    await employee.update({
      employeeCode,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      isActive,
      dateOfJoining,
      dateOfLeaving,
      branchId
    });
    res.redirect('/employees');
}
    catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;