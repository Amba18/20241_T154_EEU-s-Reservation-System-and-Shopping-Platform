const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Fetch all products (with optional filtering)
router.get('/', async (req, res) => {
    const { category, min_price, max_price } = req.query;
    
    try {
        const filters = {};
        if (category) filters.category = category;
        if (min_price) filters.price = { $gte: min_price };
        if (max_price) filters.price = { ...filters.price, $lte: max_price };

        const products = await Product.find(filters);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

module.exports = router;
