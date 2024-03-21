const { default: mongoose } = require('mongoose');

const mongoURI = "mongodb://localhost:27017/inotebook";

// http://localhost:3000/api/authentication

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;
