const{sequelize}=require('./models');
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err=>console.error('DB connection failed:',err));