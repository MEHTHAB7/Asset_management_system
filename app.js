require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');



app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));


app.get('/', (req, res) => {
  res.render('index');
});
  app.use('/employees', require('./routes/employees'));
  app.use('/categories', require('./routes/categories'));
  app.use('/assets', require('./routes/assets'));
  app.use('/stock', require('./routes/stock'));
  app.use('/transactions', require('./routes/transactions'));
  app.listen(process.env.PORT, () => console.log('server running on port' + process.env.PORT));