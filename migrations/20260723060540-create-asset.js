'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AssetCategories',
          key: 'id'
        },
      },
      branchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Branches',
          key: 'id'
        },
      },
      currentEmployeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Employees',
          key: 'id'
        },  
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
       
      },

      assetTag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      serialNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      make: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      purchaseDate: {
        type: Sequelize.DATEONLY
      },
      purchasePrice: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false,
        defaultValue:0
      },
      status: {
  type: Sequelize.ENUM('IN_STOCK', 'ISSUED', 'IN_REPAIR', 'SCRAPPED'),
  allowNull: false,
  defaultValue: 'IN_STOCK'
},
      vendor: {
        type: Sequelize.STRING
      },
      warrantyExpiryDate: {
        type: Sequelize.DATEONLY
      },
      scrapReason: {
        type: Sequelize.TEXT
      },
      scrapDate: {
        type: Sequelize.DATEONLY
      },
      notes: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Assets');
  }
};