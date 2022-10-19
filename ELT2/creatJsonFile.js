// file system module to perform file operations
const fs = require('fs');
 
// json data
// var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';

var jsonData = '{"parameters":[{"city":"Haifa","branch":"Vanilla","amount":0.6,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":4,"minute":37,"season":"autumn","today_weather":"cold"}, {"city":"Ashkelon","branch":"Golda","amount":0.4,"Ice_cream_flavor":"lemon","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Ramla","branch":"Ben & Jerrys","amount":0.5,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Holon","branch":"Vanilla","amount":0.2,"Ice_cream_flavor":"halva","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Tel Aviv","branch":"Deli cream","amount":0.1,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Yavne","branch":"Jetlek","amount":0.6,"Ice_cream_flavor":"lemon","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Hadera","branch":"Vanilla","amount":0.5,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}]}';

// parse json
var jsonObj = JSON.parse(jsonData);
console.log(jsonObj);
 
// stringify JSON Object
var jsonContent = JSON.stringify(jsonObj);
console.log(jsonContent);
 
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});