const express = require('express')
const router = express.Router()

const {
    getMainPage
} = require("../controllers/inventory")

router.route("/").get(getMainPage)

module.exports = router