const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Create Express app
const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/reservation-shopping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.log("MongoDB connection error", err);
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
