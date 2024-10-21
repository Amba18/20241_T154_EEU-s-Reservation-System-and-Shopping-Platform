const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Simple route for home page
app.get('/', (req, res) => {
  res.send('Welcome to EEU\'s Reservation System and Shopping Platform!');
});

// Example route for products
app.get('/api/v1/products', (req, res) => {
  res.json({
    success: true,
    message: 'Here are the available products',
    products: [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ]
  });
});

// Example route for reservation system
app.get('/api/v1/reservations', (req, res) => {
  res.json({
    success: true,
    message: 'Here are the reservations',
    reservations: [
      { id: 1, user: 'John Doe', service: 'Hotel Room', date: '2024-10-25' },
      { id: 2, user: 'Jane Smith', service: 'Event Ticket', date: '2024-10-30' }
    ]
  });
});

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

