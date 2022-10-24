const createError = require('http-errors');
const express = require('express');
const app = express();

const connectDB = require('./Model/mongoDB/connect');

const PORT = 5000;

const trainModelRouter = require('./routes/tainModel');
const cityDetailsRouter = require('./routes/cityPredictionInfo')

app.use('/api/v1/train_model', trainModelRouter);
app.use('/api/v1/city_details', cityDetailsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}...`)
    })
  } catch (error) {
    console.log(error);
  }
};

start();