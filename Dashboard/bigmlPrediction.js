const bigml = require('bigml');

// replace the username and the API KEY of your own
var connection = new bigml.BigML('AMIRGO49', 'd394fdd70b9f51c50d6a5614856b95217e3ec96b')

var source = new bigml.Source(connection);
const getPrediction = (req, res, modelResourceKey, storeName, flavor, date) => {
    source.get(modelResourceKey, function (error, modelInfo) {
        if (!error && modelInfo) {
            var prediction = new bigml.Prediction(connection);
            prediction.create(modelInfo,
                {"city": storeName, "flavor": flavor, "date": date},
                function (error, prediction) {
                    console.log(prediction.code);
                    console.log(prediction.object.output);
                    res.json({response: prediction.object.output})
                });
        }
    })
}

const getWeeklyPrediction = async (req, res, modelResourceKey, storeName, flavor) => {
    source.get(modelResourceKey, function (error, modelInfo) {
        if (!error && modelInfo) {
            var prediction = new bigml.Prediction(connection);
            var weekPredictions = [];

            // Get initial date
            var baseDate = new Date();
            baseDate.setDate(baseDate.getDate() + 1);

            for (let i = 0; i < 7; i++) {
                const date = `${baseDate.getDay()}-${baseDate.getMonth()}-${baseDate.getFullYear()}`
                console.log(date)
                prediction.create(modelInfo,
                    {"city": storeName, "flavor": flavor, "date": date},
                    function (error, prediction) {
                        console.log(prediction.code);
                        console.log(prediction.object.output);
                        weekPredictions.push(prediction.object.output);
                    });
            }
            res.json({response: weekPredictions})
        }
    })
}

const getPredictionPromise = (modelResourceKey, storeName, flavor, date) => {
    return new Promise((resolve, reject) => {
        source.get(modelResourceKey, function (error, modelInfo) {
            if (!error && modelInfo) {
                var prediction = new bigml.Prediction(connection);
                prediction.create(modelInfo,
                    {"city": storeName, "flavor": flavor, "date": date},
                    function (error, prediction) {
                        console.log(prediction.code);
                        console.log(prediction.object.output);
                        resolve(prediction.object.output);
                    });
            }
            else{
                reject(error);
            }
        })
    })
}


module.exports = {
    getPrediction,
    getWeeklyPrediction,
    getPredictionPromise
}