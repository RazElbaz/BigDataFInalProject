const {
    getCityPopulation,
    getCityPopulationType
} = require('../Model/mySQL/readWriteCity')

// Classification map for converting the locality religion to the population type.
// 1 - jews
// 2 - arabs
// 4 - mixed (arabs and jews)
const populationTypeMap = {'1': 'jews', '2': 'arabs', '4': 'mixed (arabs and jews)'}


const getCityDetails = async (req, res) => {
    const {city: cityName} = req.params;
    console.log(cityName)
    // Search out in mySQL for sale city's settelment details
    // and send it back to the client.
    const populationJSON = await getCityPopulation(cityName);
    
    // Convert population from decimal to precentages
    var keys = Object.keys(populationJSON);
    for(let i = 0; i < keys.length - 1; i++){
        populationJSON[keys[i]] = `${populationJSON[keys[i]] * 100}%`;
    }
    
    const cityPopulationTypeJSON = await getCityPopulationType(cityName);
    console.log(cityPopulationTypeJSON)
    cityPopulationTypeJSON['population_type'] = populationTypeMap[cityPopulationTypeJSON['population_type']];

    // Merge jsons to one json and push it to the sales array
    let cityDetailsJSON = Object.assign(populationJSON, cityPopulationTypeJSON);
    
    res.status(200).json({reponse: cityDetailsJSON})
}

module.exports = {
    getCityDetails
}