const express = require('express');
const router = express.Router();

const {
    getCityDetails
} = require('../controllers/cityPredictionInfo')


router.route('/:city').get(getCityDetails)

module.exports = router;