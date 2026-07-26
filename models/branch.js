'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
   
    static associate(models) {
      Branch.hasMany(models.Employee, {foreignKey:'branchId',as:'employees'});
      Branch.hasMany(models.Asset, {foreignKey:'branchId',as:'assets'});
      Branch.hasMany(models.AssetTransaction, {foreignKey:'branchId',as:'assetTransactions'});

    }
  }
  Branch.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    address: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Branch',
  });
  return Branch;
};