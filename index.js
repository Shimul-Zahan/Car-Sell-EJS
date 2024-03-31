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

app.get('/details', (req, res) => {
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

app.post('/register', manageController.registerUser);
app.post('/create-car', manageController.createCar);
app.post('/update-car', manageController.updateCar);
app.post('/delete-car', manageController.deleteCar);
app.post('/create-post', manageController.createCar);
app.get('/', manageController.getAllCar);


const final = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

final()
