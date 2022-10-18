const redis = require('ioredis')

const initialFlavorsAmount = 120;
const cities = ['Ashdod','Tel Aviv','Haifa','Ramat Gan','Eilat','Ashkelon','Sderot','Netanya','Herzliya','Petah Tiqwa','Beer Sheva','Holon', 'Lod','Ramla','Yavne','Hadera','Ness Ziona','Jerusalem','Ariel','Dimona']
const branches = ['Golda','Vanilla','Ben & Jerrys','Deli cream','Jetlek']
const flavors = ["chocolate", "vanilla", "strawberry", "lemon", "halva"]

const conn = {
    port: 6379,
    host: "127.0.0.1",
    db: 0
};
const redisDb = new redis(conn);

function fixSub(num1, num2){
    return (10*num1 - 10*num2) / 10
}

const getStoresName = async () => {
    let storesList;
    try {
        storesList = await redisDb.lrange("stores", 0, -1)
    }
    catch (err) {
        console.log(err);
    }
    return storesList;
}

const getFlavorAmount = async (storeName, flavorName) => {
    let flavorAmount;
    try {
        flavorAmount = await redisDb.hget(storeName, flavorName);
    }
    catch (err) {
        console.log(err);
    }
    return flavorAmount;
}

const getStoreFlavors = async (storeName) => {
    let flavorsJSON;
    try {
        flavorsJSON = await redisDb.hgetall(storeName);
        for(const key in flavorsJSON)
            flavorsJSON[key] = Number(flavorsJSON[key])
    }
    catch (err) {
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
    }
    catch (err) {
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
            flavorsJSON[`${flavor}_amount`] = sum/10;
        }
    }
    catch (err) {
        console.log(err);
    }
    return flavorsJSON;
}

// Set method
const setInitialData = async () => {
    for(const city of cities){
        for (const branch of branches){
            const storeName = `${city}-${branch}`;

            // Set initial store's flavor amount
            for (const flavor of flavors)
                await redisDb.hset(storeName, flavor, initialFlavorsAmount);

            // Push store name to the stores list
            await redisDb.rpush('stores', storeName);
        }
    }
}

const setFlavorAmount = async (storeName, flavor, amountToReduce) =>  {
    const currAmount = await redisDb.hget(storeName, flavor);
    console.log(currAmount + ' ' + amountToReduce + ' ' + (currAmount <= amountToReduce))
    // Stock running out - reset it back to the initial flavor amount
    if (currAmount <= amountToReduce) {
        await redisDb.hset(storeName, flavor, fixSub(initialFlavorsAmount, amountToReduce));
        return;
    }
    await redisDb.hset(storeName, flavor, fixSub(currAmount, amountToReduce));
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
    setInitialData,
    setFlavorAmount,
    deleteStores
}