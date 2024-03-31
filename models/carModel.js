const mongoose = require('mongoose');
const { Schema } = mongoose;

const carSchema = new Schema({
    carName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    availability: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    mileage: {
        type: String,
        required: true,
    },
    transmission: {
        type: String,
        required: true,
    },
    fuelType: {
        type: String,
        required: true,
    },
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
