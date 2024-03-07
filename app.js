require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./utils/connectDB');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(process.env.NODE_ENV);
}

app.get('/', (req, res) => {
  res.send('Hello World');
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
