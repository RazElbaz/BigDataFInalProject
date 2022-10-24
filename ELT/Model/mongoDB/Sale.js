const mongoose = require('mongoose')

const SaleSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, 'must provide a city name'],
    },
    amount: {
        type: Number,
        required: [true, 'must provide purchase amount']
    },
    flavor: {
        type: String,
        required: [true, 'must provide purchase ice cream flavor']
    },
    holiday_weak: {
        type: Boolean
    },
    date: {
        type: String,
        required: [true, 'must provide purchase date']
    },
    season: {
        type: String,
        required: [true, 'must provide season name']
    },
    weather: {
        type: String,
        required: [true, 'must provide today`s weather status']
    }
}, {collection: 'sales'})

module.exports = mongoose.model('Sale', SaleSchema)