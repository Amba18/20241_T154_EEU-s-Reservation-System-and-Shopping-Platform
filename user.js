const express = require('express');
const EEU = express.Router();

let inventory = [];
let reservations = [];
let users = [];

// Middleware to simulate user session
let loggedInUser = null;

// Student Signup
EEU.post('/signup', function (req, res) {
    const { username, password } = req.body;
    
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('User already exists.');
    }

    users.push({ username, password });
    res.send('Signup successful.');
});

// Student Login
EEU.post('/login', function (req, res) {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).send('Invalid credentials.');
    }

    loggedInUser = user;  // Simulate session
    res.send(`Welcome, ${username}!`);
});

// View Inventory (Dashboard)
EEU.get('/inventory', function (req, res) {
    if (!loggedInUser) {
        return res.status(401).send('Please login to view the inventory.');
    }
    res.json(inventory);
});

// Reserve product
EEU.post('/reserve', function (req, res) {
    if (!loggedInUser) {
        return res.status(401).send('Please login to reserve a product.');
    }

    const { productName, quantity } = req.body;
    const product = inventory.find(item => item.productName === productName);
    
    if (!product || product.quantity < quantity) {
        return res.status(400).send('Product not available or insufficient stock.');
    }

    reservations.push({ 
        customerName: loggedInUser.username, 
        productName, 
        quantity, 
        status: 'Pending' 
    });
    product.quantity -= quantity;  // Temporarily reduce stock
    
    res.send(`Reservation for ${quantity} units of ${productName} placed by ${loggedInUser.username}.`);
});

// View Reservations
EEU.get('/reservations', function (req, res) {
    if (!loggedInUser) {
        return res.status(401).send('Please login to view reservations.');
    }

    const userReservations = reservations.filter(res => res.customerName === loggedInUser.username);
    res.json(userReservations);
});

// Approve reservation (Admin-only)
EEU.put('/reservations/approve', function (req, res) {
    const { customerName, productName } = req.body;
    const reservation = reservations.find(res => res.customerName === customerName && res.productName === productName);
    
    if (!reservation) {
        return res.status(404).send('Reservation not found.');
    }
    
    reservation.status = 'Approved';
    res.send(`Reservation for ${customerName} approved.`);
});

// Cancel reservation
EEU.put('/reservations/cancel', function (req, res) {
    if (!loggedInUser) {
        return res.status(401).send('Please login to cancel a reservation.');
    }

    const { productName } = req.body;
    const reservation = reservations.find(res => res.customerName === loggedInUser.username && res.productName === productName);
    
    if (!reservation) {
        return res.status(404).send('Reservation not found.');
    }
    
    // Return stock to inventory
    const product = inventory.find(item => item.productName === productName);
    product.quantity += reservation.quantity;  // Re-add reserved stock to inventory
    
    reservation.status = 'Cancelled';
    res.send(`Reservation for ${loggedInUser.username} cancelled.`);
});

// Add stock to inventory (Admin-only)
EEU.post('/inventory/add', function (req, res) {
    const { productName, quantity } = req.body;
    const existingProduct = inventory.find(product => product.productName === productName);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;  // Add to existing stock
    } else {
        inventory.push({ productName, quantity });  // Add new product to inventory
    }
    
    res.send(`Added ${quantity} units of ${productName} to the inventory.`);
});

module.exports = EEU;
