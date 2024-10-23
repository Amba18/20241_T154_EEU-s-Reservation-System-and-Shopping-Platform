const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory user and product data (this is for demonstration, you should use a database in a real system)
let users = [];
let reservations = [];
let products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 }
];

// Simple authentication middleware (for demo purposes, no JWT or advanced security)
const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// 1. Signup Endpoint
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// 2. Login Endpoint
app.post('/login', authenticateUser, (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

// 3. Reserve Product Endpoint
app.post('/reserve', authenticateUser, (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  reservations.push({ username: req.user.username, product });
  res.status(201).json({ message: 'Product reserved', reservation: { product, username: req.user.username } });
});

// 4. Cancel Reservation Endpoint
app.post('/cancel', authenticateUser, (req, res) => {
  const { productId } = req.body;
  const reservationIndex = reservations.findIndex(r => r.product.id === productId && r.username === req.user.username);
  if (reservationIndex === -1) {
    return res.status(404).json({ message: 'Reservation not found' });
  }
  reservations.splice(reservationIndex, 1); // Remove reservation
  res.json({ message: 'Reservation canceled' });
});

// 5. Receive Payment Slip Endpoint
app.post('/receive-payment', authenticateUser, (req, res) => {
  const { productId, paymentSlipUrl } = req.body;
  const reservation = reservations.find(r => r.product.id === productId && r.username === req.user.username);
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }
  if (!paymentSlipUrl) {
    return res.status(400).json({ message: 'Payment slip URL is required' });
  }
  reservation.paymentSlip = paymentSlipUrl;
  res.json({ message: 'Payment slip received', reservation });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send('Sorry, that route does not exist');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

