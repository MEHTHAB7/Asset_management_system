const { sequelize, Branch, Employee, AssetCategory, Asset, AssetTransaction } = require('./models');

async function test() {
  await sequelize.authenticate();
  console.log('DB connected');

  const branch = await Branch.create({ name: 'Test Branch', location: 'Test City' });
  const employee = await Employee.create({
    employeeCode: 'EMP001',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    branchId: branch.id,
  });
  const category = await AssetCategory.create({ name: 'Laptop' });
  const asset = await Asset.create({
    assetTag: 'LAP-0001',
    serialNumber: 'SN12345',
    categoryId: category.id,
    branchId: branch.id,
    purchasePrice: 50000,
  });

  const fullAsset = await Asset.findByPk(asset.id, {
    include: ['category', 'branch'],
  });
  console.log(JSON.stringify(fullAsset, null, 2));

  await sequelize.close();
}

test().catch(console.error);