const {
    getCurrentSeason,
    isWeekHoliday,
    getCityWeather
} = require('../additionalData')

const getAdditionalInfo = async (req, res) => {
    const {city : cityName} = req.params;
    const special_day = isWeekHoliday(new Date());
    const season = getCurrentSeason(new Date());
    const weather = await getCityWeather(cityName);
    res.status(200).json({"holiday_weak": special_day, "season": season, "weather": weather})
}

module.exports = {
    getAdditionalInfo
}