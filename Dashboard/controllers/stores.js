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
const fetch = require("node-fetch");

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

        // request
        let fetchObj = await fetch(`http://localhost:5000/api/v1/additional_info/${storeName}`);
        if (!fetchObj.ok) throw new Error(`Error! status: ${fetchObj.status}`);
        const additionalInfoJSON = await fetchObj.json();

        let fetchObj2 = await fetch(`http://localhost:5000/api/v1/city_details/${storeName}`);
        if (!fetchObj2.ok) throw new Error(`Error! status: ${fetchObj2.status}`);
        const cityInfoJSON = await fetchObj2.json();

        const concatJSON = Object.assign({"city": storeName, "flavor": flavor, "date": date}, additionalInfoJSON['reponse'],
            {'population_size': cityInfoJSON['reponse']['population_size'], 'population_type': cityInfoJSON['reponse']['population_type']})
        console.log(concatJSON)

        const prediction_value = await getPredictionPromise(modelResourceKey, concatJSON);
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