// const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const carSchema = new Schema({
    name: {
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
        type: Number,
        required: true,
    },
    createAt: {
        type: Date,
        required: true,
    },
    availability: {
        type: Number,
        required: true,
    },
    color: {
        type: Number,
        required: true,
    },
})


const Car = mongoose.model('Car', carSchema);
module.exports = User;
/*
{
    "name": "Tesla Model S",
    "image": "tesla_model_s.jpg",
    "model": "Model S",
    "price": 79999,
    "description": "Electric sedan with advanced features",
    "createAt": "2024-04-01T12:00:00.000Z",
    "availability": 10,
    "color": "Red"
}
*/ 