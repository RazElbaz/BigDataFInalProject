const fetch = require('node-fetch');

const {
    getStoresName,
    getFlavorAmount,
    getAllFlavorAmount,
    getAllFlavors,
    getModelResourceKey,
    setModelResourceKey
} = require('../models/stores')

const {getPrediction, getPredictionPromise} = require('../bigmlPrediction')


const flavor_card = {chocolate_amount: 2, vanilla_amount: 2, strawberry_amount: 4, lemon_amount: 6, halva_amount: 13}
const flavorsList = ["Chocolate", "Vanilla", "Strawberry", "Lemon", "Halva"]
const flavorsListCard = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]

const getMainPage = async (req, res) => {
    const storesName = await getStoresName();
    const flavorsJSON = await getAllFlavors(flavorsListCard);

    const dropdown_cards =
        [
            {title: "Select Store", rows: storesName, selectID: "store_select"},
            {title: "Select Flavor", rows: flavorsList, selectID: "flavor_select"}
        ]
    const ML_card = {
        title: "Preparing data and sending it to a learning service",
        button_title: "train model",
        buttonID: "train_model",
        dropdown_cards: dropdown_cards
    }

    res.render("pages/train_model_dashboard", {flavor_card: flavorsJSON, ML_card: ML_card})
}

const getTrainModelInfo = async (req, res) => {
    console.log('training model...')

    // request
    let fetchObj = await fetch('http://localhost:5000/api/v1/train_model');
    if (!fetchObj.ok) {
        throw new Error(`Error! status: ${fetchObj.status}`);
    }
    const {response: modelResourceKey} = await fetchObj.json();
    await setModelResourceKey(modelResourceKey);

    res.json({response: 'Successfully sent a message to the train model server, to create the model!'})
}

const getConsumptionPrediction = async (req, res) => {
    const {store: storeName, flavor: flavor, date: date} = req.params;
    const modelResourceKey = await getModelResourceKey();

    console.log(storeName + ' ' + flavor + ' ' + date)
    const prediction_value = await getPredictionPromise(modelResourceKey, storeName, flavor, date);
    res.status(200).json({response: prediction_value});
}

module.exports = {
    getMainPage,
    getTrainModelInfo,
    getConsumptionPrediction
}