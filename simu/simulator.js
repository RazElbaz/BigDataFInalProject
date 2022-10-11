const { all } = require("mathjs");


//A callback function is in another scope so we'll create a global variable that will hold the weather for the city in this event
let cityWeather= '';
// //for create random events
// let iceCream_now = [];
var Ice_cream_flavor=['chocolate','vanilla','strawberry','lemon','halva']
var city=['Ashdod','Tel Aviv','Haifa','Ramat Gan','Eilat','Ashkelon','Sderot','Netanya','Herzliya','Petah Tiqwa','Beer Sheva','Holon', 'Lod','Ramla','Yavne','Hadera','Ness Ziona','Jerusalem','Ariel','Dimona']
var branch=['Golda','Vanilla','Ben & Jerrys','Deli cream','Jetlek']
//probability to choose some flavor
var probability = [0.6, 0.1, 0.1, 0.1,0.1];
module.exports.simulator = function(cb){
    setInterval(function(){ Simulator_sales(cb)},1500)
}

function Simulator_sales(sd){    
        var sales_data = {};
        /*
        creating an empty array of length 20,then filling it with 0 and then replacing zeros with random number. 
        Math.random() generates floating number,so to float to int,using Bitwise OR(|)
        */
        sales_data.city = city[(Math.random() * city.length) | 0];
        //the same as the previous random array r of size 5
        sales_data.branch = branch[(Math.random() * branch.length) | 0];
        sales_data.amount=(Math.floor(Math.random() * 10) + 1)/10 ;//kilo
        sales_data.Ice_cream_flavor = getRandomFlavor();
        //special day
        var isSpecialWeek=false;
        /*
        for Jewish
        https://github.com/hebcal/hebcal-js
        npm install hebcal
        */
        var Hebcal = require('hebcal');
        var date=new Date().getDay()+1;
        for(var i=1;i<date;i++){
              const day = new Hebcal.HDate(new Date());
              day.setDate(day.getDate() -i);
              if(day.holidays().length>0){
                  isSpecialWeek=true;
              }
        }
        for(var i=date;i<8;i++){
              const day = new Hebcal.HDate(new Date());
              day.setDate(day.getDate() -date +i);
                if(day.holidays().length>0){
                  isSpecialWeek=true;
              }
        }

        sales_data.special_week =isSpecialWeek;

        //Time
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate
        var date=new Date();//The getDate() method returns the day of the month for the specified date according to local time.
        sales_data.month=date.getMonth()+1;//Gets the month, using local time.
        sales_data.day=date.getDay()+1; //Gets the day of the week, using local time.
        sales_data.hour=date.getHours();//Gets the hours in a date, using local time
        sales_data.minute=date.getMinutes();//Gets the minutes of a Date object, using local time.

        //Season
        sales_data.season=getCurrentSeason();

        //weather
        //https://codeburst.io/build-a-simple-weather-app-with-node-js-in-just-16-lines-of-code-32261690901d
        //npm install request --save
        let request = require('request');
        var apiKey = '1ccd75dbf6a83f162518db512af12bc3'; 
        
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${sales_data.city}&units=metric&appid=${apiKey}`
        var temp=0;

        request(url, function (err, response, body) {
          if(err){
            console.log('error:', error);
          } else {
            let weather = JSON.parse(body)
            let message = `It's ${weather.main.temp} degrees in ${weather.name}!`
          
            temp=parseInt(weather.main.temp);
            //console.log(temp);
            if(temp<10){
              //console.log(temp);
              cityWeather="very cold";
            }
            else if(temp<20){
              cityWeather="cold";
              //console.log(temp);
            }
            else if(temp<25){
              cityWeather="pleasant weather";
              //console.log(temp);
            }
            else if(temp<30){
              cityWeather="hot";
              //console.log(temp);
            }
            else if(temp<40){
              cityWeather="very hot";
              //console.log(temp);
            }
            
          }}
        );
        sales_data.today_weather=cityWeather;
        //console.log(sales_data.today_weather);
      
        sd(sales_data);
    }

function getRandomFlavor() {
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

 function getCurrentSeason() {
    /**
 * https://gist.github.com/jossef/d904cd0838304b0e6c01
 * Retrieves the current season: 1) summer, 2) winter, 3) autumn or 4) spring
 *
 * Winter:  22 Dec - 21 Mar
 * Spring:  22 Mar - 21 Jun
 * Summer:  22 Jun - 21 Sep
 * autumn:    22 Sep - 21 Dec
 */
    // It's plus one because January is index 0
    const now = new Date();
    const month = now.getMonth() + 1;
  
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
  
    const day = now.getDate();
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