// import {jArray1} from './ELTconsumer.js';

const { Parser } = require('json2csv');
const fs = require('fs');

const jArray1 = [{"city":"Haifa","branch":"Vanilla","amount":0.6,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":4,"minute":37,"season":"autumn","today_weather":"cold"}, {"city":"Ashkelon","branch":"Golda","amount":0.4,"Ice_cream_flavor":"lemon","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Ramla","branch":"Ben & Jerrys","amount":0.5,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Holon","branch":"Vanilla","amount":0.2,"Ice_cream_flavor":"halva","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Tel Aviv","branch":"Deli cream","amount":0.1,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Yavne","branch":"Jetlek","amount":0.6,"Ice_cream_flavor":"lemon","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}, {"city":"Hadera","branch":"Vanilla","amount":0.5,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":6,"minute":50,"season":"autumn","today_weather":"hot"}];
// const jArray1 = {"city":"Haifa","branch":"Vanilla","amount":0.6,"Ice_cream_flavor":"chocolate","special_week":true,"month":10,"day":4,"hour":4,"minute":37,"season":"autumn","today_weather":"cold"}
const parserObj = new Parser();

var csv = parserObj.parse(jArray1);
// for(i=1; i<jArray1.length; i++){
//   csv += "\n" + parserObj.parse(Object.values(jArray1[i]));
// }
// console.log(jArray1);
// const csv = parserObj.parse(jArray1);

console.log(csv);

fs.writeFileSync('./parameters.csv', csv);