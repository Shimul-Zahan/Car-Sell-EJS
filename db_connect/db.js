const mongoose = require('mongoose');
require('dotenv').config();

const connecting = () => {
    const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.waps95s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    return uri;
}

const connectDB = async () => {
    console.log('testing.....');
    const test = connecting();
    await mongoose.connect(test, { dbName: 'CAR_SELLING_DB' })
    console.log('connected');
}


module.exports = connectDB;