const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Asset, Employee, AssetTransaction, sequelize } = require('../models');

router.get('/issue', async (req, res) => {
  try {
    const assets = await Asset.findAll({ where: { status: 'IN_STOCK' } });
    const employees = await Employee.findAll({ where: { isActive: true } });
    res.render('transactions/issue', { assets, employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/issue', async (req, res) => {
  try {
    const { assetId, employeeId } = req.body;
    await sequelize.transaction(async (t) => {
      const asset = await Asset.findByPk(assetId, { transaction: t });
      if (!asset || asset.status !== 'IN_STOCK') {
        throw new Error('Asset is not available for issue');
      }
      await asset.update({
        status: 'ISSUED',
        currentEmployeeId: employeeId,
      }, { transaction: t });

      await AssetTransaction.create({
        assetId: asset.id,
        employeeId,
        branchId: asset.branchId,
        transactionType: 'ISSUE',
        transactionDate: new Date(),
        performedBy: 'system',
      }, { transaction: t });
    });
    res.redirect('/assets');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/return', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'ISSUED' },
      include: [{ model: Employee, as: 'currentHolder' }],
    });
    res.render('transactions/return', { assets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/return', async (req, res) => {
  try {
    const { assetId, returnReason, condition, remarks } = req.body;
    await sequelize.transaction(async (t) => {
      const asset = await Asset.findByPk(assetId, { transaction: t });
      if (!asset || asset.status !== 'ISSUED') {
        throw new Error('Asset is not currently issued');
      }
      const previousEmployeeId = asset.currentEmployeeId;
      const newStatus = returnReason === 'REPAIR' ? 'IN_REPAIR' : 'IN_STOCK';

      await asset.update({
        status: newStatus,
        currentEmployeeId: null,
      }, { transaction: t });

      await AssetTransaction.create({
        assetId: asset.id,
        employeeId: previousEmployeeId,
        branchId: asset.branchId,
        transactionType: 'RETURN',
        returnReason,
        condition,
        remarks,
        transactionDate: new Date(),
        performedBy: 'system',
      }, { transaction: t });
    });
    res.redirect('/assets');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/scrap', async (req, res) => {
  try {
    const assets = await Asset.findAll({ where: { status: { [Op.ne]: 'SCRAPPED' } } });
    res.render('transactions/scrap', { assets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/scrap', async (req, res) => {
  try {
    const { assetId, scrapReason } = req.body;
    await sequelize.transaction(async (t) => {
      const asset = await Asset.findByPk(assetId, { transaction: t });
      if (!asset || asset.status === 'SCRAPPED') {
        throw new Error('Asset is already scrapped or does not exist');
      }
      await asset.update({
        status: 'SCRAPPED',
        scrapReason,
        scrapDate: new Date(),
      }, { transaction: t });

      await AssetTransaction.create({
        assetId: asset.id,
        employeeId: asset.currentEmployeeId,
        branchId: asset.branchId,
        transactionType: 'SCRAP',
        remarks: scrapReason,
        transactionDate: new Date(),
        performedBy: 'system',
      }, { transaction: t });
    });
    res.redirect('/assets');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;