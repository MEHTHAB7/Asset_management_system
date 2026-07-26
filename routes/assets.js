const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Asset, AssetCategory, Branch, AssetTransaction,Employee, sequelize } = require('../models');


router.get('/', async (req, res) => {
  try {
  const where = { status: { [Op.ne]: 'SCRAPPED' } };
    if (req.query.categoryId) {
  where.categoryId = req.query.categoryId;
}
    if (req.query.search) {
  where[Op.or] = [
    { make: { [Op.iLike]: `%${req.query.search}%` } },
    { model: { [Op.iLike]: `%${req.query.search}%` } },
  ];
}
const assets = await Asset.findAll({
  where,
  include: [
    { model: AssetCategory, as: 'category' },
    { model: Branch, as: 'branch' }
  ]
});
const categories = await AssetCategory.findAll();
   res.render('assets/index', { assets, categories, query: req.query });
} catch (err) {
  res.status(500).json({ error: err.message });
}
  });
router.get('/new', async (req, res) => {
  try {
    const categories = await AssetCategory.findAll();
    const branches = await Branch.findAll();
    res.render('assets/new', { categories, branches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
    const { assetTag, serialNumber, purchaseDate, make, model, vendor, warrantyExpiryDate, scrapReason, scrapDate, notes } = req.body;
    await sequelize.transaction(async (t) => {
      const asset = await Asset.create({
        assetTag,
        serialNumber,
        make,
        model,
        purchaseDate,
        vendor,
        warrantyExpiryDate, 
        scrapReason,
        scrapDate,
        notes,
        categoryId: req.body.categoryId,
        branchId: req.body.branchId,
        purchasePrice: req.body.purchasePrice,  
    }, { transaction: t });
    await AssetTransaction.create({
      assetId: asset.id,
      branchId: asset.branchId,
      transactionType: 'PURCHASE',
      transactionDate: new Date(),
      performedBy: 'system',
    }, { transaction: t });
    });
    res.redirect('/assets');
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});

router.get('/:id/edit', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [
         { model: AssetCategory, as: 'category' },
         { model: Branch, as: 'branch' }
      ]
    });
    const categories = await AssetCategory.findAll();
    const branches = await Branch.findAll();
    res.render('assets/edit', { asset, categories, branches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    const { assetTag, serialNumber, purchaseDate, make, model, vendor, warrantyExpiryDate,scrapReason, scrapDate, notes } = req.body;
    await asset.update({
      assetTag,
        serialNumber,
        make,
        model,
        purchaseDate,
        vendor,
        warrantyExpiryDate, 
        scrapReason,
        scrapDate,
        notes,
        categoryId: req.body.categoryId,
        branchId: req.body.branchId,
        purchasePrice: req.body.purchasePrice,
    });
    res.redirect('/assets');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/view', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [
        { model: AssetCategory, as: 'category' },
        { model: Branch, as: 'branch' }
      ]
    });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    const history = await AssetTransaction.findAll({
      where: { assetId: req.params.id },
      include: [{ model: Employee, as: 'employee' }],
      order: [['transactionDate', 'ASC']],
    });
    res.render('assets/history', { asset, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;