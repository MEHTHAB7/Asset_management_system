'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    
    static associate(models) {
      Employee.belongsTo(models.Branch, {foreignKey:'branchId',as:'branch'});
      Employee.hasMany(models.Asset, {foreignKey:'currentEmployeeId',as:'assetHeld'});
      Employee.hasMany(models.AssetTransaction, {foreignKey:'employeeId',as:'assetTransactions'});
    }
  }
  Employee.init({
    employeeCode: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    department: DataTypes.STRING,
    designation: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    dateOfJoining: DataTypes.DATEONLY,
    dateOfLeaving: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};