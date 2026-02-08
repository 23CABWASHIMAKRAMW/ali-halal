const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// Replace your old CORS line with this:
app.use(cors({
  origin: "*", // Allows any website (Vercel, Localhost, etc.) to access the data
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Add this right below it to handle "pre-flight" requests
app.options('*', cors());
app.use(express.json());

// --- MONGODB MODELS ---

const itemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  price: Number,
  category: String,
  isAvailable: { type: Boolean, default: true }
}, { collection: 'items' });
const Item = mongoose.model('Item', itemSchema);

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

// 1. ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// This DELETE route allows the Admin Panel to "Complete" orders
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. REVIEWS
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. WAITER REQUESTS
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
    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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