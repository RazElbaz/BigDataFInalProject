const {
    getStoresName,
    getFlavorAmount,
    getStoreFlavors,
    getAllFlavorAmount,
    getAllFlavors,
    getModelResourceKey
} = require('../models/stores')

const {getWeeklyPrediction, getPredictionPromise} = require('../bigmlPrediction')
const bigml = require("bigml");

const flavorsList = ["Chocolate", "Vanilla", "Strawberry", "Lemon", "Halva"]
const flavorsListCard = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]
// const flavor_card = { chocolate_amount: 2, vanilla_amount: 2, strawberry_amount: 4, lemon_amount: 6, halva_amount: 13}

function getWeekDays(locale)
{
    var todayDate = new Date(); // just a Monday
    var tomorrowDate = new Date()
    tomorrowDate.setDate(todayDate.getDate() + 1)
    console.log(tomorrowDate)
    var weekDays = [];
    for(let i = 0; i < 7; i++)
    {
        weekDays.push(tomorrowDate.toLocaleDateString(locale, { weekday: 'long' }));
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    }
    return weekDays;
}

const getMainPage = async (req, res) => {
    const storesName = await getStoresName();
    const flavorsJSON = await getAllFlavors(flavorsListCard);

    // Total amount in all net.
    const lineChart_labels = getWeekDays('en-US');
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
}

const getStorePage = async (req, res) => {
    const {store: storeName} = req.params;
    const storeFlavorsJSON = await getStoreFlavors(storeName);
    res.status(200).json(storeFlavorsJSON);
}


const getWeeklyConsumptionPrediction = async (req, res) => {
    const {store: storeName, flavor: flavor} = req.params;
    console.log(storeName + ' ' + flavor)
    const modelResourceKey = await getModelResourceKey();

    let weekPredictions = [];

    // Get initial date
    let baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);

    for (let i = 0; i < 7; i++) {
        const date = `${baseDate.getDate()}-${baseDate.getMonth() + 1}-${baseDate.getFullYear()}`;
        console.log(date)
        const prediction_value = await getPredictionPromise(modelResourceKey, storeName, flavor, date);
        weekPredictions.push(prediction_value);
        baseDate.setDate(baseDate.getDate() + 1);
    }
    res.status(200).json({response: weekPredictions});
}

module.exports = {
    getMainPage,
    getStorePage,
    getWeeklyConsumptionPrediction
}