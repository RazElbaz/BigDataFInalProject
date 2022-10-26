const express = require('express');
const router = express.Router();

const {
    getAdditionalInfo
} = require('../controllers/additionalInfo')

router.route('/:city').get(getAdditionalInfo)

module.exports = router;