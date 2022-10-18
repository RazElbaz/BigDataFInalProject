const {
    getStoresName,
    getFlavorAmount,
    getStoreFlavors,
    getAllFlavorAmount,
    getAllFlavors
} = require('../models/stores')

const flavorsList = ["Chocolate", "Vanilla", "Strawberry", "Lemon", "Halva"]
const flavorsListCard = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]
// const flavor_card = { chocolate_amount: 2, vanilla_amount: 2, strawberry_amount: 4, lemon_amount: 6, halva_amount: 13}

const getMainPage = (req, res) => {
    getStoresName().then((storesName) => {
        getAllFlavors(flavorsListCard).then((flavorsJSON) => {
            // Total amount in all net.
            const lineChart_labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const lineChart_data = [0, 0, 0, 0, 0, 0, 0]
            const lineChart = {lineChart_labels: lineChart_labels, lineChart_data: lineChart_data}

            // Chosen store stock amount for each flavor.
            const barChart_labels = ["Chocolate", "Vanilla", "Strawberry", "Lemon", "Halva"]
            const barChart_data = [0, 0, 0, 0, 0]
            const barChart = {barChart_labels: barChart_labels, barChart_data: barChart_data}
            const dropdown_cards =
                [
                    {title: "Select Store", rows: storesName, selectID: "store_select"},
                    {title: "Select Flavor", rows: flavorsList, selectID: "flavor_select"}
                ]
            res.render("pages/stores_dashboard", {
                flavor_card: flavorsJSON,
                dropdown_cards: dropdown_cards,
                lineChart: lineChart,
                barChart: barChart
            })
        })
    })
}

const getStorePage = (req, res) => {
    const {store: storeName} = req.params
    getStoreFlavors(storeName).then((storeFlavorsJSON) => {
        res.status(200).json(storeFlavorsJSON)
    })
}


const getWeeklyConsumptionPrediction = (req, res) => {
    const {store: storeName, flavor: flavor} = req.params;
    console.log(storeName + ' ' + flavor)
    res.status(200).json({store: storeName, flavor: flavor})
}

module.exports = {
    getMainPage,
    getStorePage,
    getWeeklyConsumptionPrediction
}