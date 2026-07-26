'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssetTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AssetTransaction.belongsTo(models.Asset, {foreignKey:'assetId',as:'asset'});
      AssetTransaction.belongsTo(models.Employee, {foreignKey:'employeeId',as:'employee'});
      AssetTransaction.belongsTo(models.Branch, {foreignKey:'branchId',as:'branch'});
    }
  }
  AssetTransaction.init({
    assetId: DataTypes.INTEGER,
    employeeId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
    transactionType: DataTypes.ENUM('PURCHASE','ISSUE','RETURN','REPAIR_IN','REPAIR_OUT','SCRAP'),
    returnReason:DataTypes.ENUM('UPGRADE','REPAIR','RESIGNATION','DAMAGED','OTHER'),
    transactionDate: DataTypes.DATE,
    condition: DataTypes.STRING,
    remarks: DataTypes.TEXT,
    performedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetTransaction',
  });
  return AssetTransaction;
};