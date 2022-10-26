let request = require('request');

var city = ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZiyyon', 'Petah Tiqwa', 'Netanya', 'Ashdod', 'Bene Beraq', "Be'er Sheva", 'Holon', 'Ramat Gan', 'Ashkelon', 'Bet Shemesh', 'Rehovot', 'Bat Yam', 'Herzliyya', 'Hadera', 'Kefar Sava', "Modiin", 'Lod', "Modi'in Illit", "Raanana", 'Ramla', 'Nazareth', 'Rahat', 'Rosh HaAyin', 'Hod HaSharon', 'Beitar Ilit', 'Nahariyya', 'Qiryat Gat', "Givatayim", 'Qiryat Ata', 'Afula', 'Umm el Fahm', 'Yavne', 'Elat', 'Akko', 'Ness Ziona', "Elad", 'Ramat HaSharon', 'Tiberias', 'Qiryat Motzkin', "Karmi'el", 'Taibe', 'Netivot', 'Pardes Hana-Karkur', 'Qiryat Bialik', 'Nazerat Illit', "Shefaram", 'Qiryat Ono', 'Qiryat Yam', 'Or Yehuda', 'Zefat', "Maale Adomim", 'Dimona', 'Tamra', 'Ofaqim', 'Sakhnin', 'Sederot', 'Harish', 'Yehud', 'Turan', 'Gedera', "Beer Yaaqov", 'Kefar Yona', "Givat Shemuel", 'Tirat Karmel', 'Arad', 'Tira', 'Arrabe', 'Migdal HaEmeq', "Arara", "Kiryat Malachi", 'Mevaseret Tsiyon', 'Kfar Kasim', 'Gan Yavne', 'Hura', "Yoqneam Illit", "Zichron Ya'akov", 'Kalanswa', 'Kfar Kanna', 'Maghar', 'Nesher', 'Kseifa', 'Ganei Tikva', 'Kadima', 'Daliyat Al-Karmel', 'Qiryat Shemona', "Maalot Tarshiha", 'Shoham', 'Yirka', 'Kafar Manda', "Givat Zeev", 'Or Akiva', "Ar'ara BaNegev", 'Kfar Kara', "Ariel", 'Yafia', 'Reina', "Qiryat Tivon"]

var apiKey = '1ccd75dbf6a83f162518db512af12bc3';


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

// Usage:
async function main() {
    try {
        for (c of city) {
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${c}&units=metric&appid=${apiKey}`
            console.log(url)
            let response = await doRequest(url);
            console.log(c)
            //console.log(response); // `response` will be whatever you passed to `resolve()` at the top
        }
    } catch (error) {
        console.error(error); // `error` will be whatever you passed to `reject()` at the top
    }
}

main();