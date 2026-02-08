const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// --- MONGODB MODELS (Fixed for ali_halal) ---

const orderSchema = new mongoose.Schema({
  phoneNumber: String,
  tableNumber: String,
  items: Array, 
  totalAmount: Number, 
  paymentMethod: { type: String, default: 'Cash' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'orders' });
const Order = mongoose.model('Order', orderSchema);

const reviewSchema = new mongoose.Schema({
  customerName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'reviews' });
const Review = mongoose.model('Review', reviewSchema);

const requestSchema = new mongoose.Schema({
  tableNumber: String,
  requestType: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'requests' });
const Request = mongoose.model('Request', requestSchema);

// --- API ROUTES ---
// index.js (Add this if it's missing or update it)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find(); // This looks in the 'items' collection
    if (items.length === 0) {
      return res.status(404).json({ message: "No items found in database" });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.set('Cache-Control', 'no-store');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    console.log("New Order Received:", req.body); // Check Render Logs for this!
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Save Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/requests/:id', async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: "Request cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Ali Halal Server is running... 🚀');
});

// --- DATABASE CONNECTION (CRITICAL FIX) ---
const dbURI = process.env.MONGO_URI;
// This ensures we connect to the 'ali_halal' database folder specifically
mongoose.connect(dbURI, { dbName: 'ali_halal' }) 
  .then(() => console.log("✅ Ali Halal Database Connected!"))
  .catch(err => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));