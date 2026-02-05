const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- MONGODB MODELS ---

// 1. Menu Item Model
const itemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  price: Number,
  category: String,
  isAvailable: { type: Boolean, default: true }
}, { collection: 'items' });
const Item = mongoose.model('Item', itemSchema);

// 2. Order Model (Matched to your JSON data)
const orderSchema = new mongoose.Schema({
  phoneNumber: String,
  tableNumber: String,
  items: Array,
  totalAmount: Number, 
  paymentMethod: { type: String, default: 'Cash' },
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'orders' });
const Order = mongoose.model('Order', orderSchema);

// 3. Review Model
const reviewSchema = new mongoose.Schema({
  customerName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'reviews' });
const Review = mongoose.model('Review', reviewSchema);

// 4. Waiter Request Model
const requestSchema = new mongoose.Schema({
  tableNumber: String,
  requestType: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'requests' });
const Request = mongoose.model('Request', requestSchema);


// --- API ROUTES (GET & POST) ---

// --- MENU ---
app.get('/api/menu', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDERS ---
// GET Orders for Admin
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST New Order from Client
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- REVIEWS ---
// GET Reviews for Admin
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST New Review from Client
app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- WAITER REQUESTS ---
// GET Requests for Admin
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST New Waiter Call from Client
app.post('/api/requests', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Ali Halal Server is running... 🚀');
});

// --- DATABASE CONNECTION ---
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log("✅ Ali Halal Database Connected!"))
  .catch(err => console.log("❌ DB Error:", err));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));