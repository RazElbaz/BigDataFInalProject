const {
    getStoresName,
    getFlavorAmount,
    getAllFlavorAmount,
    getAllFlavors
} = require('../models/stores')

const flavor_card = {chocolate_amount: 2, vanilla_amount: 2, strawberry_amount: 4, lemon_amount: 6, halva_amount: 13}
const flavorsListCard = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]

const getMainPage = async (req, res) => {
    const flavorsJSON = await getAllFlavors(flavorsListCard);
    const pieChart_labels = ["Chocolate", "Vanilla", "Strawberry", "Lemon", "Halva"]
    const pieChart_data = [flavorsJSON.chocolate_amount, flavorsJSON.vanilla_amount, flavorsJSON.strawberry_amount, flavorsJSON.lemon_amount, flavorsJSON.halva_amount]
    const pieChart = {pieChart_labels: pieChart_labels, pieChart_data: pieChart_data}

    const info_cards =
        [
            {title: "האם חג קרוב השבוע", info: "-"},
            {title: "עונה נוכחית", info: "-"}
        ]
    res.render("pages/dashboard", {flavor_card: flavorsJSON, info_cards: info_cards, pieChart: pieChart})
}

module.exports = {
    getMainPage
}