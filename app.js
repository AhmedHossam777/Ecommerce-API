require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/connectDB');

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const notFound = require('./middleware/notFound');
const globalErrorHandler = require('./middleware/globalErrorHandler');

const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
});
