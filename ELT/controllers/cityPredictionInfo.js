const {
    getCityPopulation,
    getCityPopulationType
} = require('../Model/mySQL/readWriteCity')


const getCityDetails = async (req, res) => {
    const {city: cityName} = req.params;
    console.log(cityName)
    // Search out in mySQL for sale city's settelment details
    // and send it back to the client.
    const populationJSON = await getCityPopulation(cityName);
    const cityPopulationTypeJSON = await getCityPopulationType(cityName);

    // Merge jsons to one json and push it to the sales array
    let cityDetailsJSON = Object.assign(populationJSON, cityPopulationTypeJSON);
    
    res.status(200).json({reponse: cityDetailsJSON})
}

module.exports = {
    getCityDetails
}