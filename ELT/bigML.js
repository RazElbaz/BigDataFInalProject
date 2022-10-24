// https://github.com/bigmlcom/bigml-node/blob/master/docs/index.md
// https://www.dataem.com/bigml
// Don't run the all code all the time - produce a model ONCE and use for predictions from now on
// Look for an asyc version.

const bigml = require('bigml');

// replace the username and the API KEY of your own
var connection = new bigml.BigML('AMIRGO49','d394fdd70b9f51c50d6a5614856b95217e3ec96b')
var source = new bigml.Source(connection);

const createSalesTreeModel = (req, res) => {
    source.create('./sales_history.csv', function(error, sourceInfo) {
        if (!error && sourceInfo) {
            var dataset = new bigml.Dataset(connection);
            dataset.create(sourceInfo, function(error, datasetInfo) {
                if (!error && datasetInfo) {
                    var model = new bigml.Model(connection);
                    model.create(datasetInfo, function (error, modelInfo) {
                        if (!error && modelInfo) {
                            res.header("Access-Control-Allow-Origin", "*");
                            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                            res.status(200).json({response: modelInfo.resource});
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    createSalesTreeModel
}
