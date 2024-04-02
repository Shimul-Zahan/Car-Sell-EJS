const express = require('express');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const manageController = require('./controller/manage');
const connectDB = require('./db_connect/db');
// const bodyParser = require('body-parser');
app.use('/uploads', express.static('uploads'));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


function verifyToken(req, res, next) {
    const token = req.cookies.token_for_car;
    console.log(token);
    if (!token) {
        // alert("unauthorized acces. login now.")
        return res.redirect('/login');
    }

    jwt.verify(token, 'gsT7jMFXvbUwDCYJqy4k3mVrHs82RyWn', (err, decoded) => {
        if (err) {
            // alert("unauthorized acces. login now.")
            return res.redirect('/login');
        }
        req.decoded = decoded;
        next();
    });
}

function getToekn(req, res, next) {
    const user = [];
    const token = req.cookies.token_for_car;
    console.log(token);
    if (!token) {
        user.push(null);
        return next();
    }

    // Verify the token
    jwt.verify(token, 'gsT7jMFXvbUwDCYJqy4k3mVrHs82RyWn', (err, decoded) => {
        if (err) {
            user.push(null);
        } else {
            user.push(decoded);
        }
        req.user = user;
        next();
    });
}

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

app.get('/', getToekn, manageController.getAllCar);

app.get('/about', getToekn, async (req, res) => {
    const user = req.user ? req.user[0] : null;
    res.render('about', { user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/post-car', verifyToken, async (req, res) => {
    res.render('sellCar');
});

app.get('/registration', getToekn, async (req, res) => {
    const user = req.user ? req.user[0] : null;
    res.render('registration', { user });
});

// Route for the home page
app.get('/home', verifyToken, getToekn, async (req, res) => {
    const sidebarRoutes = await shared(req);
    res.render('dashboard', { content: 'home', sidebarRoutes });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token_for_car');
    res.redirect('/');
});

app.get('/products', verifyToken, getToekn, async (req, res) => {
    const cars = await manageController.getAllCarForDashboard();
    const sidebarRoutes = await shared(req);
    const user = req.user ? req.user[0] : null;
    res.render('dashboard', { content: 'products', cars, sidebarRoutes, user });
});

app.get('/add-car', verifyToken, getToekn, async (req, res) => {
    const sidebarRoutes = await shared(req);
    res.render('dashboard', { content: 'add-car', sidebarRoutes });
});

app.get('/sort', verifyToken, getToekn, manageController.sorting)
app.get('/search', verifyToken, getToekn, manageController.searchCars);
app.get('/delete-item/:id', verifyToken, getToekn, manageController.deleteCar);
app.post('/register', manageController.registerUser);
app.post('/create-car', manageController.createCar);
app.post('/update-single-car/:id', verifyToken, getToekn, manageController.updateCar);
app.post('/delete-car', manageController.deleteCar);
app.post('/create-post', verifyToken, getToekn, manageController.createCar);
app.get('/', manageController.getAllCar);
app.post('/login', getToekn, manageController.login);
app.get('/details/:id', getToekn, manageController.details);
app.get('/updateCar/:id', verifyToken, getToekn, manageController.updateSingleCar);
app.get('/users', verifyToken, getToekn, manageController.getAllUsers);

const final = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

final()
