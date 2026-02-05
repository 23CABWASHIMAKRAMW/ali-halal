const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// Allows your Vercel frontend and Admin panel to access this API
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- MONGODB MODELS (Synchronized with your actual data) ---

// 1. Menu Item Schema
const itemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  price: Number,
  category: String,
  isAvailable: { type: Boolean, default: true }
}, { collection: 'items' }); // Explicitly pointing to 'items' collection
const Item = mongoose.model('Item', itemSchema);

// 2. Order Schema (Updated to match your JSON data)
const orderSchema = new mongoose.Schema({
  phoneNumber: String,
  tableNumber: String,
  items: [
    {
      itemName: String,
      price: Number,
      _id: mongoose.Schema.Types.ObjectId
    }
  ],
  totalAmount: Number, // Matches your DB field
  paymentMethod: String,
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'orders' });
const Order = mongoose.model('Order', orderSchema);

// 3. Review Schema
const reviewSchema = new mongoose.Schema({
  customerName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'reviews' });
const Review = mongoose.model('Review', reviewSchema);

// 4. Waiter Request Schema
const requestSchema = new mongoose.Schema({
  tableNumber: String,
  requestType: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'requests' });
const Request = mongoose.model('Request', requestSchema);


// --- API ROUTES ---

// GET: All Menu Items
app.get('/api/menu', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All Orders (For Admin Panel)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All Waiter Requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root Health Check
app.get('/', (req, res) => {
  res.send('Ali Halal Server is running... 🚀');
});

// --- DATABASE CONNECTION ---
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/alihalal';

mongoose.connect(dbURI)
  .then(() => console.log("✅ Ali Halal Database Connected Successfully!"))
  .catch(err => console.log("❌ DB Error:", err));

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});