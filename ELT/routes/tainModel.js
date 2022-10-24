const express = require('express');
const router = express.Router();

const {
    trainModel
} = require('../controllers/trainModel')

router.route('/').get(trainModel)
router.route('/city_prediction_details/:city')

module.exports = router;