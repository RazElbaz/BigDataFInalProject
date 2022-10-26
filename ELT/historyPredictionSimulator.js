/*
    ice cream prediction patterns:
    Friday - arab buy chocolate ice cream
    high tem - a lot of ice cream at summer
    summer - a lot of ice cream
    low tem - less ice cream
    wensday - mix cities lemon flavor
    high senior precentages - a lot of halva flavor
*/
const Hebcal = require('hebcal');
let request = require('request');

const connectDB = require('./Model/mongoDB/connect');

const {
    createSale,
    removeAllSales
} = require('./Model/mongoDB/readWriteSale')


const {
    getCityPopulation,
    getCityPopulationType
} = require('./Model/mySQL/readWriteCity')

const {
    getCurrentSeason,
    isWeekHoliday,
    getCityWeather
} = require('./additionalData')

let probabilities = [0.6, 0.1, 0.1, 0.1, 0.1]
let Ice_cream_flavor = ['chocolate', 'vanilla', 'strawberry', 'lemon', 'halva']

// Gives a random method for Array object to give
// a random element in an array.
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

//X loops: date [chosenDate -> today] -> store -> flavor
//VX current total amount - accumulated amount of the current flavor sales
//V season -> random weather: winter [cold, very cold], autumn [pleasant weather, cold, very cold], spring [hot, very hot, pleasant weather], summer [pleasant weather,hot, very hot]
//V population from mysql

/*
    var dayOrderNumber = current_date.day + 1;

    if day === 6 && locality_religion === 'arabs':
        probabilities[0] = 0.2
        probabilities[1] = 0.1
        probabilities[2] = 0.5
        probabilities[3] = 0.1
        probabilities[4] = 0.1

    if weather === 'hot' || weather === 'very hot':
        consumptionRate = 'high'

    if weather === 'very cold':
        consumptionRate = 'very low'

    if weather === 'cold':
        consumptionRate = 'low'

    if day === 4 && locality_religion === 'mixed (arabs and jews)':
        probabilities[0] = 0.2
        probabilities[1] = 0.1
        probabilities[2] = 0.1
        probabilities[3] = 0.5
        probabilities[4] = 0.1

    high senior precentage (for example: haifa) >= 38%
    if  14=== 6 && locality_religion === 'arabs':
        probabilities[0] = 0.2
        probabilities[1] = 0.1
        probabilities[2] = 0.5
        probabilities[3] = 0.1
        probabilities[4] = 0.1
*/


var cities = ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZiyyon', 'Petah Tiqwa', 'Netanya', 'Ashdod', 'Bene Beraq', "Be'er Sheva", 'Holon', 'Ramat Gan', 'Ashkelon', 'Bet Shemesh', 'Rehovot', 'Bat Yam', 'Herzliyya', 'Hadera', 'Kefar Sava', "Modiin", 'Lod', "Modi'in Illit", "Raanana", 'Ramla', 'Nazareth', 'Rahat', 'Rosh HaAyin', 'Hod HaSharon', 'Beitar Ilit', 'Nahariyya', 'Qiryat Gat', "Givatayim", 'Qiryat Ata', 'Afula', 'Umm el Fahm', 'Yavne', 'Elat', 'Akko', 'Ness Ziona', "Elad", 'Ramat HaSharon', 'Tiberias', 'Qiryat Motzkin', "Karmi'el", 'Taibe', 'Netivot', 'Pardes Hana-Karkur', 'Qiryat Bialik', 'Nazerat Illit', "Shefaram", 'Qiryat Ono', 'Qiryat Yam', 'Or Yehuda', 'Zefat', "Maale Adomim", 'Dimona', 'Tamra', 'Ofaqim', 'Sakhnin', 'Sederot', 'Harish', 'Yehud', 'Turan', 'Gedera', "Beer Yaaqov", 'Kefar Yona', "Givat Shemuel", 'Tirat Karmel', 'Arad', 'Tira', 'Arrabe', 'Migdal HaEmeq', "Arara", "Kiryat Malachi", 'Mevaseret Tsiyon', 'Kfar Kasim', 'Gan Yavne', 'Hura', "Yoqneam Illit", "Zichron Ya'akov", 'Kalanswa', 'Kfar Kanna', 'Maghar', 'Nesher', 'Kseifa', 'Ganei Tikva', 'Kadima', 'Daliyat Al-Karmel', 'Qiryat Shemona', "Maalot Tarshiha", 'Shoham', 'Yirka', 'Kafar Manda', "Givat Zeev", 'Or Akiva', "Ar'ara BaNegev", 'Kfar Kara', "Ariel", 'Yafia', 'Reina', "Qiryat Tivon"]

const startHistorySimulator = async () => {
    try {
        await connectDB();
        createDaysCitySales(new Date(2022, 9, 20))
    } catch (error) {
        console.log(error);
    }
};
startHistorySimulator();

async function createDaysCitySales(target_date){
    let today = new Date();
    today.setHours(0,0,0,0)
    console.log(target_date.getDate())
    while (today.getTime() !== target_date.getTime()) {
        console.log(today.getTime() + ', ' + target_date.getTime())
        for (city of cities) {
            console.log(city)
            probabilities = [0.6, 0.1, 0.1, 0.1, 0.1];
            await createCitySales(city, target_date, probabilities);
        }
        target_date.setDate(target_date.getDate() + 1);
    }
    console.log('Simulator has created everything!')
}


async function createCitySales(cityName, date) {
    let currentTotalAmount = 0;
    
    const season = getCurrentSeason(date);
    console.log(season)

    // Random weather map: given the season returns random weather status.
    const randWeatherMap = {
        'winter': ['cold', 'very cold'].random(),
        'autumn': ['pleasant weather', 'cold', 'very cold'].random(),
        'spring': ['hot', 'very hot', 'pleasant weather'].random(),
        'summer': ['pleasant weather', 'hot', 'very hot'].random()
    }
    const consumptionRatings = {
        'zero': [0, 1],
        'low': [1,20],
        'average': [20, 60],
        'high': [60, 120],
        'very high': [120, Infinity]
    }

    const consumptionRatingsArr = ['zero', 'low', 'average', 'high', 'very high']
    let consumptionRate = consumptionRatingsArr.random();
    //console.log(consumptionRate)

    // Build selected date as following format: day-month-year
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const randWeather = randWeatherMap[season];
    const holiday_week = isWeekHoliday(date)
    
    console.log(randWeather)
    //console.log(holiday_week)

    const cityPopulationJSON = Object.assign(await getCityPopulation(cityName), await getCityPopulationType(cityName));
    //console.log(cityPopulationJSON)

    var dayOrderNumber = date.getDay() + 1;
    //console.log(dayOrderNumber);
    
    // Prediction injected features

    // Arabs consume a lot of strawberry
    if (dayOrderNumber === 6 && cityPopulationJSON['population_type'] === 2) {
        probabilities[0] = 0.2;
        probabilities[1] = 0.1;
        probabilities[2] = 0.5;
        probabilities[3] = 0.1;
        probabilities[4] = 0.1;
    }

    if (randWeather === 'hot' || randWeather === 'very hot') consumptionRate = 'high';
    
    if (randWeather === 'very cold') consumptionRate = 'zero';

    if (randWeather === 'cold') consumptionRate = 'low';

    if (dayOrderNumber === 4 && cityPopulationJSON['population_type'] === 4){
        probabilities[0] = 0.2;
        probabilities[1] = 0.1;
        probabilities[2] = 0.1;
        probabilities[3] = 0.5;
        probabilities[4] = 0.1;
    }

    // High senior (age = 46+) precentage of halva consumption(for example: haifa) >= 38%
    const highSeniorPrecentages = cityPopulationJSON['precentage_age_46_55'] + cityPopulationJSON['precentage_age_56_64'] + cityPopulationJSON['precentage_age_65_plus'];
    if  (highSeniorPrecentages >= 0.38) {
        probabilities[0] = 0.2;
        probabilities[1] = 0.1;
        probabilities[2] = 0.1;
        probabilities[3] = 0.1;
        probabilities[4] = 0.5;
    }

    //console.log(probabilities);

    //console.log(consumptionRate)
    //console.log(consumptionRatings[consumptionRate])
    // Make artificial sales in the current date, store, and flavor
    const startRange = consumptionRatings[consumptionRate][0];
    const endRange = consumptionRate === 'very high'? 200 : consumptionRatings[consumptionRate][1];
    const newStartRange = Math.random() * (endRange - startRange) + startRange
    //console.log(newStartRange + ', ' + startRange + ', ' + endRange)

    while(currentTotalAmount < endRange){
        if (currentTotalAmount >= newStartRange) break;
        var current_flavor = getRandomFlavor(probabilities)
        var sale_amount = (Math.floor(Math.random() * 10) + 1)/10 ; //kilo
        console.log(`${current_flavor}, ${sale_amount}`)
        let saleJSON = {
            'city': cityName,
            'amount' : sale_amount,
            'Ice_cream_flavor' : current_flavor,
            'special_week': holiday_week,
            'year': year,
            'month': month,
            'day': day,
            'season': season,
            'today_weather': randWeather
        }
        console.log(saleJSON)
        await createSale(saleJSON);
        currentTotalAmount += sale_amount;
    }

    console.log(Math.floor(currentTotalAmount * 10)/10)
}

function getRandomFlavor(probability) {
    /*
    Creating a random array with a certain probability for the flavor of ice cream
    */
    var rand = Math.random();
    var max = 0;
    var lastIndex = probability.length - 1;

    for (var i = 0; i < lastIndex; ++i) {
        max += probability[i];
        if (rand < max) {
            return Ice_cream_flavor[i];
        }
    }
    return Ice_cream_flavor[lastIndex];
};

