const mysql = require('mysql2');

// Get locality code
const getLocalityCode = 'SELECT `Locality Code` FROM `cities and religions` WHERE `English Locality Name` = ?';

// GET POPULATION
const getPopulation = 'SELECT precentage_age_0_5, precentage_age_6_18, precentage_age_19_45, precentage_age_46_55, precentage_age_56_64, precentage_age_65_plus, population AS population_size FROM `population and ages` WHERE `Locality Code` = ?';

// GET LOCALITY RELIGION
const getLocalityReligion = 'SELECT `Locality religion` FROM `cities and religions` WHERE `Locality Code` = ?';

// Classification map for converting the locality religion to the population type.
// 1 - jews
// 2 - arabs
// 4 - mixed (arabs and jews)
const populationTypeMap = {'1': 'jews', '2': 'arabs', '4': 'mixed (arabs and jews)'}

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "amior35000",
    database: "bigdata"
});
const promisePool = pool.promise();

const getCityPopulation = async (cityName) => {
    let cityPopulationJSON;
    try {
        const [cityLocalityCodeRows, cityLocalityCodeFields] = await promisePool.execute(getLocalityCode, [cityName]);
        const locality_code = cityLocalityCodeRows[0]['Locality Code'];
        const [cityPopulationRows, cityPopulationFields] = await promisePool.execute(getPopulation, [locality_code]);
        cityPopulationJSON = cityPopulationRows[0];
        
        // Convert population from decimal to precentages
        var keys = Object.keys(cityPopulationJSON);
        for(let i = 0; i < keys.length - 1; i++){
            cityPopulationJSON[keys[i]] = `${cityPopulationJSON[keys[i]] * 100}%`;
        }
    } catch (err) {
        console.log(err);
    }
    return cityPopulationJSON;
}

const getCityPopulationType = async (cityName) => {
    let cityPopulationType;
    try {
        const [cityLocalityCodeRows, cityLocalityCodeFields] = await promisePool.execute(getLocalityCode, [cityName]);
        const locality_code = cityLocalityCodeRows[0]['Locality Code'];
        const [cityLocalityReligionRows, cityLocalityReligionFields] = await promisePool.execute(getLocalityReligion, [locality_code])
        cityPopulationType = populationTypeMap[cityLocalityReligionRows[0]['Locality religion']];
        console.log(cityLocalityReligionRows[0])
    } catch (err) {
        console.log(err);
    }
    return {population_type: cityPopulationType};
}

module.exports = {
    getCityPopulation,
    getCityPopulationType
}