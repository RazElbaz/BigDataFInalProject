const mongoose = require('moongose')

const connectionString =
    "mongodb+srv://yuvalbm:mjRtNevHIdLQPJns@bigdataproject.wztpjci.mongodb.net/bigdataproject?retryWrites=true&w=majority"
    
mongoose.connect(connectionString)
