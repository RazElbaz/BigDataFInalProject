const fs = require("fs");
const { Parser } = require('json2csv');
const {getAllSales} = require('../Model/mongoDB/readWriteSale')
const {
    getCityPopulation,
    getCityPopulationType
} = require('../Model/mySQL/readWriteCity')

const {createSalesTreeModel} = require('../bigML')

// Classification map for converting the locality religion to the population type.
// 1 - jews
// 2 - arabs
// 4 - mixed (arabs and jews)
const populationTypeMap = {'1': 'jews', '2': 'arabs', '4': 'mixed (arabs and jews)'}


const trainModel = async (req, res) => {
    console.log('training...')

    // Prepare data to bigML
    const salesArray = await getAllSales();
    let newSalesArray = []
    for (sale of salesArray) {
        var saleJSON = sale._id;
        const cityName = saleJSON['city'];
        console.log(cityName)
        
        // Search out in mySQL for sale city's settelment details
        // and update the sale with the new properties.
        const populationJSON = await getCityPopulation(cityName);
        if(!populationJSON) continue;
        
        // Convert population from decimal to precentages
        var keys = Object.keys(populationJSON);
        for(let i = 0; i < keys.length - 1; i++){
            console.log(populationJSON[keys[i]])
            populationJSON[keys[i]] = `${populationJSON[keys[i]] * 100}%`;
        }
        
        // City population type 
        const cityPopulationTypeJSON = await getCityPopulationType(cityName);
        cityPopulationTypeJSON['population_type'] = populationTypeMap[cityPopulationTypeJSON['population_type']];
        
        // Merge jsons to one json and push it to the sales array
        saleJSON = Object.assign(saleJSON, populationJSON, cityPopulationTypeJSON);
        saleJSON['amount'] = sale['amount'];
        newSalesArray.push(saleJSON);
    }
    
    // Convert/write sales history to a csv file for future predictions
    const fields = Object.keys(newSalesArray[0]);
    const json2csvParser = new Parser({ fields });
    const salesPurchaseHistoryCsv = json2csvParser.parse(newSalesArray);
    fs.writeFileSync("sales_history.csv", salesPurchaseHistoryCsv);
    console.log(salesPurchaseHistoryCsv)
    
    //TODO: call the bigML with this newData (the array of JSON sales).
    // In addition, server response with the model's key back to client
    // for future prediction and to be able to request this resource.
    createSalesTreeModel(req, res);
}

module.exports = {
    trainModel
}