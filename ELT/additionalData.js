/*
     This is a module of auxiliary function asking from outside api's
     some additional data which will be added to the sale.
*/

const Hebcal = require('hebcal');
let request = require('request');

function getCurrentSeason(current_date) {
    /**
     * https://gist.github.com/jossef/d904cd0838304b0e6c01
     * Retrieves the current season: 1) summer, 2) winter, 3) autumn or 4) spring
     *
     * Winter:  22 Dec - 21 Mar
     * Spring:  22 Mar - 21 Jun
     * Summer:  22 Jun - 21 Sep
     * autumn:  22 Sep - 21 Dec
     */
        // It's plus one because January is index 0
    const month = current_date.getMonth() + 1;

    if (month > 3 && month < 6) {
        return 'spring';
    }

    if (month > 6 && month < 9) {
        return 'summer';
    }

    if (month > 9 && month < 12) {
        return 'autumn';
    }

    if (month >= 1 && month < 3) {
        return 'winter';
    }

    const day = current_date.getDate();
    if (month === 3) {
        return day < 22 ? 'winter' : 'spring';
    }

    if (month === 6) {
        return day < 22 ? 'spring' : 'summer';
    }

    if (month === 9) {
        return day < 22 ? 'summer' : 'autumn';
    }

    if (month === 12) {
        return day < 22 ? 'autumn' : 'winter';
    }

    console.error('Unable to calculate current season');
};


function isWeekHoliday(current_date) {
    let isSpecialWeek = false;
    var date = current_date.getDay() + 1;
    for (var i = 1; i < date; i++) {
        const day = new Hebcal.HDate(current_date);
        day.setDate(day.getDate() - i);
        if (day.holidays().length > 0) {
            isSpecialWeek = true;
        }
    }
    for (var i = date; i < 8; i++) {
        const day = new Hebcal.HDate(current_date);
        day.setDate(day.getDate() - date + i);
        if (day.holidays().length > 0) {
            isSpecialWeek = true;
        }
    }
    return isSpecialWeek;
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

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

async function getCityWeather (cityName) {
    var apiKey = '1ccd75dbf6a83f162518db512af12bc3';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    var temp = 0;
    let body;
    
    try {
        body = await doRequest(url)
    }
    catch (err) {
        console.log(err)
    }

    let weather = JSON.parse(body)
    temp = parseInt(weather.main.temp);
    if(temp<10){
        cityWeather="very cold";
    }
    else if(temp<20){
        cityWeather="cold";
    }
    else if(temp<25){
        cityWeather="pleasant weather";
    }
    else if(temp<30){
        cityWeather="hot";
    }
    else if(temp<40){
        cityWeather="very hot";
    }
    return cityWeather;
}

module.exports = {
    getCurrentSeason,
    isWeekHoliday,
    getCityWeather
}