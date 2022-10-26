const Sale = require('./Sale');

const createSale = async (saleJSON) => {
    let schemaSaleJSON = {}

    // Set new json with the original json data and the new schema keys
    schemaSaleJSON['city'] = saleJSON['city'];
    schemaSaleJSON['amount'] = saleJSON['amount'];
    schemaSaleJSON['flavor'] = saleJSON['Ice_cream_flavor'];
    schemaSaleJSON['holiday_weak'] = saleJSON['special_week'];
    schemaSaleJSON['date'] = `${saleJSON['day']}-${saleJSON['month']}-${saleJSON['year']}`;
    schemaSaleJSON['season'] = saleJSON['season'];
    schemaSaleJSON['weather'] = saleJSON['today_weather'];

    try {
        // Save the sale as a document
        await Sale.create(schemaSaleJSON);
    } catch (err) {
        console.log(err);
    }
}

const getAllSales = async () => {
    let sales;
    try {
        sales = await Sale.aggregate(
            [
                {
                    $addFields: { amount: { $toDecimal: { $toString: "$amount" } } }
                },
                {
                    $group:
                        {
                            _id: {
                                "city": "$city",
                                "flavor": "$flavor",
                                "date": "$date",
                                "holiday_weak": "$holiday_weak",
                                "season": "$season",
                                "weather": "$weather"
                            },
                            "amount": { $sum: "$amount" }
                        }
                },
                {
                    $addFields: { "amount": { $toDouble:  "$amount" } }
                }
            ]
        )
        //console.log(sales)
    } catch (err) {
        console.log(err);
    }
    //console.log(`Current sales: ${sales}`);
    return sales;
}

const removeAllSales = async () => {
    try {
        await Sale.remove({});
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    createSale,
    getAllSales,
    removeAllSales
}