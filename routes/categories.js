const express = require('express');
const router = express.Router();
const { AssetCategory } = require('../models');

router.get('/', async (req, res) => {
  try {
  const categories = await AssetCategory.findAll();
  res.render('categories/index', { categories });
} catch (err) {
  res.status(500).json({ error: err.message });
}
});

router.get('/new', async (req, res) => {
  try {
  res.render('categories/new');
} catch (err) {
  res.status(500).json({ error: err.message })
}
});

router.post('/', async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const assetCategory = await AssetCategory.create({
      name,
      description,
      isActive,
    });
    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/edit', async (req, res) => {
    try{
    const assetCategory = await AssetCategory.findByPk(req.params.id);
    if(!assetCategory){
      return res.status(404).json({ error: 'Asset Category not found' });
    }
    res.render('categories/edit', { assetCategory });
}
    catch (err) {
    res.status(500).json({ error: err.message }); 
}
  });

router.put('/:id', async (req, res) => {
  console.log('THIS SHOULD NEVER PRINT IF METHOD OVERRIDE FAILS');

    console.log('PUT route hit, method:', req.method);
    try{
    const assetCategory = await AssetCategory.findByPk(req.params.id);
   if(!assetCategory){
      return res.status(404).json({ error: 'Asset Category not found' });
    }
    const { name, description, isActive} = req.body;

    await assetCategory.update({
      
      name,
      description,
      isActive,
      
    });
    res.redirect('/categories');
}
    catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;