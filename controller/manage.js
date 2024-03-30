// !--------------Here is registrationuser------------
async function registerUser(req, res) {
    try {
        console.log(req.body);
        const { name, email, role, password } = req.body;
        console.log(name, email, role, password);
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


module.exports = {
    registerUser,
    createCar,
    deleteCar,
    updateCar
};
