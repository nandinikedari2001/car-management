const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// In-memory storage for car records
let cars = [];
let isAdminLoggedIn = false;
let isUserLoggedIn = false;

// Routes
app.get('/admin-login', (req, res) => {
    res.render('admin-login');
});

app.post('/admin-login', (req, res) => {
    // Simple admin authentication
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        isAdminLoggedIn = true;
        res.redirect('/admin-dashboard');
    } else {
        res.send('Invalid credentials');
    }
});

app.get('/admin-dashboard', (req, res) => {
    if (!isAdminLoggedIn) return res.redirect('/admin-login');
    res.render('admin-dashboard', { cars: cars, totalCars: cars.length });
});

app.post('/add-car', (req, res) => {
    if (!isAdminLoggedIn) return res.redirect('/admin-login');
    const { carName, manufacturingYear, price } = req.body;
    cars.push({ carName, manufacturingYear, price });
    res.redirect('/admin-dashboard');
});

app.post('/update-car/:index', (req, res) => {
    if (!isAdminLoggedIn) return res.redirect('/admin-login');
    const { index } = req.params;
    const { carName, manufacturingYear, price } = req.body;
    cars[index] = { carName, manufacturingYear, price };
    res.redirect('/admin-dashboard');
});

app.post('/delete-car/:index', (req, res) => {
    if (!isAdminLoggedIn) return res.redirect('/admin-login');
    const { index } = req.params;
    cars.splice(index, 1);
    res.redirect('/admin-dashboard');
});

app.get('/user-login', (req, res) => {
    res.render('user-login');
});

app.post('/user-login', (req, res) => {
    // Simple user authentication
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
        isUserLoggedIn = true;
        res.redirect('/user-cars');
    } else {
        res.send('Invalid credentials');
    }
});

app.get('/user-cars', (req, res) => {
    if (!isUserLoggedIn) return res.redirect('/user-login');
    res.render('user-cars', { cars: cars });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
