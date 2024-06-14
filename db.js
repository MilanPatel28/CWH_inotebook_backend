const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => {
            console.log("Connected to Mongo successfully");
        })
}

module.exports = connectToMongo;