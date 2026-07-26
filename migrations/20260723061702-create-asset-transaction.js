'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AssetTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      assetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Assets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      branchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Branches',
          key: 'id'
        }
      },
      transactionType: {
        type: Sequelize.ENUM('PURCHASE', 'ISSUE','RETURN','REPAIR_OUT','REPAIR_IN','SCRAP'),
        allowNull: false
      }, 
      returnReason:{
        type: Sequelize.ENUM('UPGRADE', 'REPAIR','RESIGNATION','DAMAGED','OTHER'),
        allowNull: true
      } ,
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      condition: {
        type: Sequelize.STRING
      },
      remarks: {
        type: Sequelize.TEXT
      },
      performedBy: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AssetTransactions');
  }
};