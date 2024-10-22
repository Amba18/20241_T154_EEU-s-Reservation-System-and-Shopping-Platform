const express = require('express');
const EEU = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // For token-based authentication
const { students } = require('../../exampleDB');  

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Example credentials for admin (in real apps, these would be stored securely in a database)
const adminCredentials = {
    username: "admin",
    password: "admin123"
};

// Secret key for JWT (used for token generation)
const secretKey = "yourSecretKey";

app.post('/admin/login', function(req, res) {
    const { username, password } = req.body;

    // Check if the provided username and password match the stored credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Optionally, you can generate a JWT token for session management
        const token = jwt.sign({ username: username, role: 'admin' }, secretKey, { expiresIn: '1h' });

        // Send success response with the token
        res.json({
            message: "Login successful",
            token: token
        });
    } else {
        // If credentials don't match, send an error response
        res.status(401).json({ message: "Invalid username or password" });
    }
});


EEU.post('/admin/Dashboard/Products/Inventory', function(req, res) {
    // Extract the product ID and new stock from the request body
    const { productId, newStock } = req.body;

    // Example inventory data
    let inventory = [
        { id: 1, name: "Mugs", stock: 100 },
        { id: 2, name: "Tribal Headwear", stock: 50 }
    ];

    // Find the product by its ID
    let product = inventory.find(item => item.id === parseInt(productId));

    // Check if the product exists
    if (product) {
        // Update the stock of the product
        product.stock = parseInt(newStock);

        // Send a success response with the updated product information
        res.send(`Inventory for ${product.name} updated to ${newStock} units.`);
    } else {
        // Send an error response if the product was not found
        res.status(404).send("Product not found.");
    }
});
EEU.delete('/admin/Dashboard/Reservations', function(req, res) {
    // Extract the reservation ID and action from the request body
    const { reservationId, action } = req.body;

    // Example reservations data
    let reservations = [
        { id: 1, productId: 1, userId: 101, status: 'pending' },
        { id: 2, productId: 2, userId: 102, status: 'pending' }
    ];

    // Find the reservation by its ID
    let reservation = reservations.find(item => item.id === parseInt(reservationId));

    // Check if the reservation exists
    if (reservation) {
        if (action === 'approve') {
            // Approve the reservation
            reservation.status = 'approved';
            res.send(`Reservation ID ${reservationId} has been approved.`);
        } else if (action === 'cancel') {
            // Cancel the reservation
            reservations = reservations.filter(item => item.id !== parseInt(reservationId));
            res.send(`Reservation ID ${reservationId} has been canceled.`);
        } else {
            res.status(400).send("Invalid action. Please specify 'approve' or 'cancel'.");
        }
    } else {
        // Send an error response if the reservation was not found
        res.status(404).send("Reservation not found.");
    }
});


module.exports = EEU;
