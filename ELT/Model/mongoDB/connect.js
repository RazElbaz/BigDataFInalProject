const mongoose = require('mongoose')

const connectionString =
    "mongodb+srv://amirg00:amior35000@bigdataproject.lfu74dq.mongodb.net/Sale?retryWrites=true&w=majority"

const connectDB = () => {
    return mongoose.connect('mongodb+srv://amirg00:amior35000@bigdataproject.lfu74dq.mongodb.net/Sale?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
}

module.exports = connectDB