const multer = require('multer');
const fs = require('fs');
const Car = require('../models/carModel');
const User = require('../models/userModel');
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
            const image = req.file.filename;
            const user = new User(
                { name, email, role, password, image }
            )
            console.log(user);
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'email didn"t match' });
        }
        console.log(user);
        if (user) {
            // const passwordMatch = await bcrypt.compare(password, user.password);
            if (user.password !== password) {
                return res.json({ message: 'password didn"t match' });
            }
        }
        const cars = await getAllCarForDashboard();
        loginUser = user;
        res.render('home', { cars, loginUser });

        // const token = jwt.sign(user.email, 'dngfnjnxjmcxnxcn');
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: false,
        //     // secure: process.env.NODE_ENV === 'production',
        //     // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        // }).json({
        //     email: user.email,
        //     token,
        //     role: user.role,
        //     login: true,
        //     image: user?.image,
        //     verifyEmail: user?.verifyEmail,
        // })
    } catch (error) {
        console.log(error);
    }
}

// -------------------------------------update car(Aklima)--------------------
async function updateCar(req, res) {
    try {
        console.log(req.params.id);
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
            res.status(200).json({ message: 'Car sell post updated successfully', updatedCar });
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
            res.status(201).json({ message: 'Car sell post created successfully', result });
            return result;
        });
    } catch (error) {
        console.error('Error creating car sell post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllCar(req, res) {
    try {
        const cars = await Car.find();
        res.render("home", { cars, loginUser })
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
        res.render('details', { car });
    } catch (error) {
        console.log(error);
    }
}

async function updateSingleCar(req, res) {
    try {
        const id = req.params.id;
        const car = await getCarById(id);
        console.log(car);
        res.render('dashboard', { content: 'update-car', car });
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
        res.render('dashboard', { content: 'products', cars });
    } catch (error) {
        console.log(error);
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
};
