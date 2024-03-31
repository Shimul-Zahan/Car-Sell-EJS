const multer = require('multer');
const fs = require('fs');
const Car = require('../models/carModel');
const User = require('../models/userModel');
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
// async function login(req, res) {
//     try {
//         const { email, password, role, image, verifyEmail, name, from } = req.body;
//         const useremail = await User.findOne({ email });
//         if (useremail && from) {
//             return res.json({ message: 'already in db' });
//         }
//         if (from) {
//             const newUser = await new User({
//                 email,
//                 name,
//                 role,
//                 image,
//                 verifyEmail,
//             }).save();
//             return res.status(200).json({ message: 'successfully created', newUser });
//         }
//         // const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.json({ message: 'email didn"t match' });
//         }
//         console.log(user);
//         if (user) {
//             const passwordMatch = await bcrypt.compare(password, user.password);
//             if (!passwordMatch) {
//                 return res.json({ message: 'password didn"t match' });
//             }
//         }
//         const token = jwt.sign(user.email, 'dngfnjnxjmcxnxcn');
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: false,
//             // secure: process.env.NODE_ENV === 'production',
//             // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//         }).json({
//             email: user.email,
//             token,
//             role: user.role,
//             login: true,
//             image: user?.image,
//             verifyEmail: user?.verifyEmail,
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// !--------------Here is create car------------
async function createCar(req, res) {
    try {
        console.log(req.body);
        const { name, image, model, price, description, createdAt, availability, color } = req.body;
        console.log(name, image, model, price, description, createdAt, availability, color);
        // const useremail = await User.findOne({ email });
        // if (useremail) {
        //     return res.status(400).json({ message: 'Eamil alreay uses. Try again with new email' });
        // }
        // const hashedPassword = await bcrypt.hash(password, 10);
        // const newUser = await new User({
        //     email,
        //     password: hashedPassword,
        //     name,
        //     role: 'user',
        //     otp,
        //     image: req.file.filename,
        //     verifyEmail: true,
        // }).save();
        // res.status(200).json({ message: 'successfully created', newUser });
    } catch (error) {
        console.log(error?.message);
    }
    res.render('login', { message: "Form submitted successfully" });
}

// !-------------Here is delete-----------------
async function deleteCar(req, res) {
    // res.render('login', { message: "Form submitted successfully" });
}

async function updateCar(req, res) {
    // res.render('login', { message: "Form submitted successfully" });
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
            /*
            app.get('/sell-car', (req, res) => {
    res.render('sellCar');
});
            */
            res.status(201).json({ message: 'Car sell post created successfully', result });
        });
    } catch (error) {
        console.error('Error creating car sell post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllCar(req, res) {
    try {
        const cars = await Car.find();
        res.render("home", { cars })
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    registerUser,
    createCar,
    deleteCar,
    updateCar,
    createCar,
    getAllCar,
};
