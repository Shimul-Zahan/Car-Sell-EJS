const express = require('express');
const app = express();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Car = require('../models/carModel');
const User = require('../models/userModel');
app.use(cookieParser());

let loginUser;
console.log(loginUser, 'from top');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const uploadImage = upload.single('image');

// shared routes here
async function shared(req) {
    const user = req.user ? req.user[0] : null;
    console.log(user);
    let sidebarRoutes = [];

    // Depending on the user's role, populate sidebarRoutes array
    if (user && user.role === 'admin') {
        sidebarRoutes = [
            { path: '/', label: 'Home' },
            { path: '/users', label: 'All Users' },
            { path: '/products', label: 'All Cars' }
            // Add more routes specific to admin here
        ];
    } else if (user && user.role === 'seller') {
        sidebarRoutes = [
            { path: '/', label: 'Home' },
            { path: '/products', label: 'All Cars' }
            // Add more routes specific to seller here
        ];
    }

    return sidebarRoutes;
}

// !--------------Here is registrationuser------------
async function registerUser(req, res) {
    try {
        // Call the uploadImage middleware to handle file upload
        uploadImage(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "Something went wrong with file upload" });
            } else if (err) {
                return res.status(500).json({ message: "Something went wrong" });
            }

            const { name, email, role, password } = req.body;
            const image = req?.file?.filename;

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({ name, email, role, password: hashedPassword, image });
            const result = await user.save();
            res.render('login', { message: "Form submitted successfully", result });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// !--------------Here is login user------------
async function login(req, res) {
    try {
        const { email, password, role, name, } = req.body;
        console.log(email, password, role, name);
        const loginUser = await User.findOne({ email });
        if (!loginUser) {
            return res.json({ message: 'email didn"t match' });
        }
        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, loginUser.password);
        if (!passwordMatch) {
            return res.json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: loginUser._id, email: loginUser.email, role: loginUser.role }, 'gsT7jMFXvbUwDCYJqy4k3mVrHs82RyWn');
        res.cookie('token_for_car', token, { httpOnly: true });

        res.redirect('/');

    } catch (error) {
        console.log(error);
    }
}

// -------------------------------------update car(Aklima)--------------------
async function updateCar(req, res) {
    try {
        uploadImage(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: "Something went wrong with file upload" });
            }
            const carId = req.params.id;
            let existingCar = await Car.findById(carId);
            if (!existingCar) {
                return res.status(404).json({ error: "Car post not found" });
            }

            const { carName, model, price, availability, createdAt, color, mileage, transmission, fuelType, description } = req.body;

            existingCar.carName = carName;
            existingCar.model = model;
            existingCar.price = price;
            existingCar.availability = availability;
            existingCar.createdAt = createdAt;
            existingCar.color = color;
            existingCar.mileage = mileage;
            existingCar.transmission = transmission;
            existingCar.fuelType = fuelType;
            existingCar.description = description;
            if (req.file) {
                existingCar.image = req.file.filename;
            }
            const updatedCar = await existingCar.save();
            const cars = await getAllCarForDashboard();
            const sidebarRoutes = await shared(req);
            const user = req.user ? req.user[0] : null;
            res.render('dashboard', { content: 'products', cars, sidebarRoutes, user });
            // res.status(200).json({ message: 'Car sell post updated successfully', updatedCar });
        });
    } catch (error) {
        console.error('Error updating car sell post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


//!---POST route for creating a new car sell post---
async function createCar(req, res) {
    try {
        // Call the uploadImage middleware to handle file upload
        uploadImage(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return { message: "Something went wrong" };
            }
            const { carName, model, price, availability, createdAt, color, mileage, transmission, fuelType, description } = req.body;
            console.log({ carName, model, price, availability, createdAt, color, mileage, transmission, fuelType, description, image: req.file.filename });

            const newCar = new Car({
                carName,
                model,
                price,
                availability,
                createdAt,
                color,
                mileage,
                transmission,
                fuelType,
                image: req.file.filename,
                description
            });
            const result = await newCar.save();
            const cars = await getAllCarForDashboard();
            const sidebarRoutes = await shared(req);
            const user = req.user ? req.user[0] : null;
            res.render('dashboard', { content: 'products', cars: cars, sidebarRoutes, user });
            return result;
        });
    } catch (error) {
        console.error('Error creating car sell post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllCar(req, res) {
    try {
        console.log('hit this route');
        const user = req.user ? req.user[0] : null;
        console.log(user, 'form this home route');
        const cars = await Car.find();
        res.render("home", { cars, user })
    } catch (error) {
        res.json({ message: error.message });
    }
}


async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        const sidebarRoutes = await shared(req);
        const user = req.user ? req.user[0] : null;
        res.render('dashboard', { content: 'users', users, sidebarRoutes, user });
    } catch (error) {
        res.json({ message: error.message });
    }
}


//----------------getCarById/:id-------------------------
async function getCarById(id) {
    try {
        // const carId = req.params.id;
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ error: "Car sell post not found" });
        }
        return car;
    } catch (error) {
        console.error('Error fetching car sell post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function details(req, res) {
    try {
        const id = req.params.id;
        const car = await getCarById(id);
        const user = req.user ? req.user[0] : null;
        res.render('details', { car, user });
    } catch (error) {
        console.log(error);
    }
}

async function updateSingleCar(req, res) {
    try {
        const id = req.params.id;
        const car = await getCarById(id);
        const sidebarRoutes = await shared(req);
        const user = req.user ? req.user[0] : null;
        res.render('dashboard', { content: 'update-car', car, sidebarRoutes, user });
    } catch (error) {
        console.log(error);
    }
}


async function getAllCarForDashboard(req, res) {
    try {
        const cars = await Car.find();
        return cars;
    } catch (error) {
        res.json({ message: error.message });
    }
}

async function deleteCar(req, res) {
    try {
        const carId = req.params.id;
        console.log(carId);
        const car = await Car.deleteOne({ _id: carId });
        const cars = await getAllCarForDashboard();
        const sidebarRoutes = await shared(req);
        const user = req.user ? req.user[0] : null;
        res.render('dashboard', { content: 'products', cars, sidebarRoutes, user });
    } catch (error) {
        console.log(error);
    }
}

async function sorting(req, res) {
    try {
        const field = req.query.field;
        let cars;
        if (field === 'price') {
            cars = await Car.find().sort({ price: 1 });
        } else if (field === 'name') {
            cars = await Car.find().sort({ carName: 1 });
        } else if (field === 'createdAt') {
            cars = await Car.find().sort({ createdAt: -1 });
        } else {
            cars = await Car.find();
        }
        const sidebarRoutes = await shared(req);
        const user = req.user ? req.user[0] : null;
        res.render('dashboard', { content: 'products', cars: cars, sidebarRoutes, user });
    } catch (error) {
        console.log(error);
    }
}

async function searchCars(req, res) {
    try {
        const query = req.query.query;
        const regex = new RegExp(query, 'i');
        const cars = await Car.find({
            $or: [
                { carName: { $regex: regex } },
                { model: { $regex: regex } },
                { description: { $regex: regex } },
                { availability: { $regex: regex } },
                { color: { $regex: regex } },
                { mileage: { $regex: regex } },
                { transmission: { $regex: regex } },
                { fuelType: { $regex: regex } },
            ]
        });

        // console.log(cars);
        // Render the search results or return them as JSON based on your application's needs
        const sidebarRoutes = await shared(req);
        const user = req.user ? req.user[0] : null;
        res.render('dashboard', { content: 'products', cars: cars, sidebarRoutes, user });

    } catch (error) {
        console.error('Error searching cars:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    createCar,
    deleteCar,
    updateSingleCar,
    updateCar,
    createCar,
    getAllCar,
    getCarById,
    getAllCarForDashboard,
    login,
    deleteCar,
    details,
    getAllUsers,
    sorting,
    searchCars,
};
