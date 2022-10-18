const express = require('express')
const router = express.Router()

const {
    getMainPage,
    getStorePage,
    getWeeklyConsumptionPrediction
} = require("../controllers/stores")

router.route("/").get(getMainPage)
router.route('/:store').get(getStorePage)
router.route('/api/:store/:flavor').get(getWeeklyConsumptionPrediction)

module.exports = router