const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const manageController = require('./controller/manage');
const connectDB = require('./db_connect/db');
app.use('/uploads', express.static('uploads'));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', manageController.getAllCar);

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/details:id', async (req, res) => {
    const car = await manageController.getCarById();
    console.log(car, 'for car');
    res.render('details');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/post-car', (req, res) => {
    res.render('sellCar');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

// Route for the home page
app.get('/home', (req, res) => {
    // Render home component
    res.render('dashboard', { content: 'home' });
});

// Route for the users page
app.get('/users', (req, res) => {
    // Render users component
    res.render('dashboard', { content: 'users' });
});

// Route for the products page
app.get('/products', async (req, res) => {
    const cars = await manageController.getAllCarForDashboard();
    res.render('dashboard', { content: 'products', cars });
});

app.get('/add-car', (req, res) => {
    res.render('dashboard', { content: 'add-car' });
});

app.get('/delete-item/:id', manageController.deleteCar);
app.post('/register', manageController.registerUser);
app.post('/create-car', manageController.createCar);
app.post('/update-single-car/:id', manageController.updateCar);
app.post('/delete-car', manageController.deleteCar);
app.post('/create-post', manageController.createCar);
app.get('/', manageController.getAllCar);
app.post('/login', manageController.login);
app.get('/details/:id', manageController.details);
app.get('/updateCar/:id', manageController.updateSingleCar);


const final = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

final()
