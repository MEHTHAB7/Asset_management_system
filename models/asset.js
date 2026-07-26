'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Asset.belongsTo(models.AssetCategory, {foreignKey:'categoryId',as:'category'});
      Asset.belongsTo(models.Branch, {foreignKey:'branchId',as:'branch'});
      Asset.belongsTo(models.Employee, {foreignKey:'currentEmployeeId',as:'currentHolder'});
      Asset.hasMany(models.AssetTransaction, {foreignKey:'assetId',as:'transactions'});
    }
  }
  Asset.init({
    categoryId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
    currentEmployeeId: DataTypes.INTEGER,
    status: DataTypes.ENUM('IN_STOCK','ISSUED','IN_REPAIR','SCRAPPED'),
    assetTag: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    make: DataTypes.STRING,
    model: DataTypes.STRING,
    purchaseDate: DataTypes.DATEONLY,
    purchasePrice: DataTypes.DECIMAL,
    vendor: DataTypes.STRING,
    warrantyExpiryDate: DataTypes.DATEONLY,
    scrapReason: DataTypes.TEXT,
    scrapDate: DataTypes.DATEONLY,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Asset',
  });
  return Asset;
};