require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/connectDB');

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

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
