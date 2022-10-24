const redis = require('ioredis')

const initialFlavorsAmount = 120;
const cities = ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZiyyon', 'Petah Tiqwa', 'Netanya', 'Ashdod', 'Bene Beraq', "Be'er Sheva", 'Holon', 'Ramat Gan', 'Ashkelon', 'Bet Shemesh', 'Rehovot', 'Bat Yam', 'Herzliyya', 'Hadera', 'Kefar Sava', "Modiin", 'Lod', "Modi'in Illit", "Raanana", 'Ramla', 'Nazareth', 'Rahat', 'Rosh HaAyin', 'Hod HaSharon', 'Betar Illit', 'Nahariyya', 'Qiryat Gat', "Givatayim", 'Qiryat Ata', 'Afula', 'Umm el Fahm', 'Yavne', 'Elat', 'Akko', 'Ness Ziona', "Elad", 'Ramat HaSharon', 'Tiberias', 'Qiryat Motzkin', "Karmi'el", 'Taibe', 'Netivot', 'Pardes Hana-Karkur', 'Qiryat Bialik', 'Nazerat Illit', "Shefaram", 'Qiryat Ono', 'Qiryat Yam', 'Or Yehuda', 'Zefat', "Maale Adomim", 'Dimona', 'Tamra', 'Ofaqim', 'Sakhnin', 'Sederot', 'Harish', 'Yehud', 'Baqa Al-Gharbiyye', 'Gedera', "Beer Yaaqov", 'Kefar Yona', "Givat Shemuel", 'Tirat Karmel', 'Arad', 'Tira', 'Arrabe', 'Migdal HaEmeq', "Arara", "Kiryat Malachi", 'Mevaseret Tsiyon', 'Kfar Kasim', 'Gan Yavne', 'Hura', "Yoqneam Illit", "Zichron Ya'akov", 'Kalanswa', 'Kfar Kanna', 'Maghar', 'Nesher', 'Kseifa', 'Ganei Tikva', 'Kadima', 'Daliyat Al-Karmel', 'Qiryat Shemona', "Maalot Tarshiha", 'Shoham', 'Yirka', 'Kafar Manda', "Givat Zeev", 'Or Akiva', "Ar'ara BaNegev", 'Kfar Kara', "Ariel", 'Yafia', 'Reina', "Qiryat Tivon"]
const flavors = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]

const conn = {
    port: 6379,
    host: "127.0.0.1",
    db: 0
};
const redisDb = new redis(conn);

function fixSub(num1, num2) {
    return (10 * num1 - 10 * num2) / 10
}

const getStoresName = async () => {
    let storesList;
    try {
        storesList = await redisDb.lrange("stores", 0, -1)
    } catch (err) {
        console.log(err);
    }
    return storesList;
}

const getFlavorAmount = async (storeName, flavorName) => {
    let flavorAmount;
    try {
        flavorAmount = await redisDb.hget(storeName, flavorName);
    } catch (err) {
        console.log(err);
    }
    return flavorAmount;
}

const getStoreFlavors = async (storeName) => {
    let flavorsJSON;
    try {
        flavorsJSON = await redisDb.hgetall(storeName);
        for (const key in flavorsJSON)
            flavorsJSON[key] = Number(flavorsJSON[key])
    } catch (err) {
        console.log(err);
    }
    return flavorsJSON;
}

const getAllFlavorAmount = async (flavorName) => {
    let sum = 0;
    try {
        const storesName = await redisDb.lrange("stores", 0, -1)
        for (const store of storesName) {
            const amount = await redisDb.hget(store, flavorName);
            sum += Number(amount);
        }
    } catch (err) {
        console.log(err);
    }
    return sum;
}

// const getAllFlavors = async (flavorsList) => {
//     let flavorsJSON = {}
//     try {
//         for (const flavor of flavorsList) {
//             getAllFlavorAmount(flavor).then(amount => {
//                 flavorsJSON[`${flavor}_amount`] = amount
//             })
//         }
//     }
//     catch (err) {
//         console.log(err);
//     }
//     return flavorsJSON;
// }

const getAllFlavors = async (flavorsList) => {
    let flavorsJSON = {}
    try {
        for (const flavor of flavorsList) {
            let sum = 0;
            const storesName = await redisDb.lrange("stores", 0, -1);
            for (const store of storesName) {
                const amount = await redisDb.hget(store, flavor);
                sum += 10 * Number(amount);
            }
            flavorsJSON[`${flavor}_amount`] = sum / 10;
        }
    } catch (err) {
        console.log(err);
    }
    return flavorsJSON;
}

const getModelResourceKey = async () => {
    let modelResourceKey;
    try {
        modelResourceKey = await redisDb.get('MODEL_RESOURCE_KEY');
    } catch (err) {
        console.log(err);
    }
    return modelResourceKey;
}

// Set method
const setInitialData = async () => {
    for (const city of cities) {
        const storeName = `${city}`;

        // Set initial store's flavor amount
        for (const flavor of flavors)
            await redisDb.hset(storeName, flavor, initialFlavorsAmount);

        // Push store name to the stores list
        await redisDb.rpush('stores', storeName);

    }
}

const setFlavorAmount = async (storeName, flavor, amountToReduce) => {
    const currAmount = await redisDb.hget(storeName, flavor);
    console.log(currAmount + ' ' + amountToReduce + ' ' + (currAmount <= amountToReduce))
    // Stock running out - reset it back to the initial flavor amount
    if (currAmount <= amountToReduce) {
        await redisDb.hset(storeName, flavor, fixSub(initialFlavorsAmount, amountToReduce));
        return;
    }
    await redisDb.hset(storeName, flavor, fixSub(currAmount, amountToReduce));
}

const setModelResourceKey = async (resource_string) => {
    try {
        console.log(resource_string)
        await redisDb.set('MODEL_RESOURCE_KEY', resource_string);
    } catch (err) {
        console.log(err);
    }
}

const deleteStores = async () => {
    const storesName = await redisDb.lrange("stores", 0, -1)
    for (const store of storesName) {
        for (const flavor of flavors) {
            await redisDb.hdel(store, flavor);
        }
    }
    await redisDb.del("stores");
}

module.exports = {
    getStoresName,
    getFlavorAmount,
    getStoreFlavors,
    getAllFlavorAmount,
    getAllFlavors,
    getModelResourceKey,
    setInitialData,
    setFlavorAmount,
    setModelResourceKey,
    deleteStores
}