const express = require('express')
const router = express.Router()

const {
    getMainPage,
    getTrainModelInfo,
    getConsumptionPrediction
} = require("../controllers/train_model")

router.route("/").get(getMainPage)
router.route("/api/train_model").post(getTrainModelInfo)
router.route("/api/:store/:flavor/:date").get(getConsumptionPrediction)

module.exports = router