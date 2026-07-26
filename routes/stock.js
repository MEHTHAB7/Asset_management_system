const express = require('express');
const router = express.Router();
const { Asset, Branch, sequelize } = require('../models');

router.get('/', async (req, res) => {
  try {
    const stock = await Asset.findAll({
      where: { status: 'IN_STOCK' },
      attributes: [
        'branchId',
        [sequelize.fn('COUNT', sequelize.col('Asset.id')), 'assetCount'],
        [sequelize.fn('SUM', sequelize.col('purchasePrice')), 'totalValue'],
      ],
      include: [{ model: Branch, as: 'branch', attributes: ['name'] }],
      group: ['branchId', 'branch.id'],
      raw: true,
    });
    res.render('stock/index', { stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;