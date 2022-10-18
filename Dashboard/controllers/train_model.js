const net = require('net');

const {
    getStoresName,
    getFlavorAmount,
    getAllFlavorAmount,
    getAllFlavors
} = require('../models/stores')

const flavor_card = { chocolate_amount: 2, vanilla_amount: 2, strawberry_amount: 4, lemon_amount: 6, halva_amount: 13}
const flavorsList = ["Chocolate", "Vanilla", "Strawberry", "Lemon", "Halva"]
const flavorsListCard = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]

const getMainPage = (req, res) => {
    getStoresName().then((storesName) => {
        getAllFlavors(flavorsListCard).then((flavorsJSON) => {
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
        })
    })
}

const getTrainModelInfo = (req, res) => {
    // TODO: need to prepare a dataset and sent it.
    // After we get the info, we can save it.
    console.log('training model...')


    // Send data set to the ELT server in order to train the model.
    const client = new net.Socket();
    client.connect(5000,'localhost',function() {
        console.log('Connecting to the server');
        client.write('Hello, server!')
        client.destroy()
    });
}

const getConsumptionPrediction = (req, res) => {
    const {store: storeName, flavor: flavor, date: date} = req.params;
    console.log(storeName + ' ' + flavor + ' ' + date)
    res.status(200).json({store: storeName, flavor: flavor, date: date})
}

module.exports = {
    getMainPage,
    getTrainModelInfo,
    getConsumptionPrediction
}