'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssetCategory extends Model {
    
    static associate(models) {
      AssetCategory.hasMany(models.Asset, {foreignKey:'categoryId',as:'assets'});
    }
  }
  AssetCategory.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AssetCategory',
  });
  return AssetCategory;
};