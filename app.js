const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const subCategoryRoutes = require('./routes/subcategory');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const orderItemRoutes = require('./routes/orderitem');
const addressRoutes = require('./routes/address');

const app = express();
// Middleware setup
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads/dp', express.static(path.join(__dirname, 'uploads/dp')));
app.use('/uploads/category', express.static(path.join(__dirname, 'uploads/category')));
app.use('/uploads/subcategory', express.static(path.join(__dirname, 'uploads/subcategory')));
app.use('/uploads/product', express.static(path.join(__dirname, 'uploads/product')));

// Route setup
app.use('/auth', authRoutes);

app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subCategoryRoutes);
app.use('/product', productRoutes);
app.use('/review', reviewRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/orderItem', orderItemRoutes);
app.use('/address', addressRoutes);

// Test route
app.get('/', (req, res) => {
  res.json('Welcome to the Express App!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json('Something went wrong!');
});

const PORT=process.env.PORT ;
app.listen(PORT,async()=>{
    try {
        await sequelize.authenticate();
        console.log(`listening port number ${PORT}`)
     
    } catch (error) {
        console.log('error while connecting to db', error.message)
    }
})

