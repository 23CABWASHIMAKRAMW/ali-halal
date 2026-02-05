const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- MONGODB MODELS (The Blueprints) ---

// Menu Item Schema
const itemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  price: Number,
  category: String,
  isAvailable: { type: Boolean, default: true }
});
const Item = mongoose.model('Item', itemSchema, 'items');

// Order Schema
const orderSchema = new mongoose.Schema({
  customerName: String,
  items: Array,
  totalPrice: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema, 'orders');

// Review Schema
const reviewSchema = new mongoose.Schema({
  customerName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema, 'reviews');

// Request/Waiter Call Schema
const requestSchema = new mongoose.Schema({
  tableNumber: String,
  requestType: String, // e.g., "Call Waiter" or "Water"
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model('Request', requestSchema, 'requests');


// --- API ROUTES ---

// 1. Menu Routes
app.get('/api/menu', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Order Routes (For Admin Panel)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Review Routes (For Admin Panel)
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Waiter Request Routes
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Ali Halal Server is running... 🚀');
});

// MongoDB Connection
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/alihalal';
mongoose.connect(dbURI)
  .then(() => console.log("✅ Ali Halal Database Connected Successfully!"))
  .catch(err => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));