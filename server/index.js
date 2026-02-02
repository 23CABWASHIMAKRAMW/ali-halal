const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// We allow CORS so your Vercel frontend can talk to your Render backend
app.use(cors({ origin: "*" }));
app.use(express.json());

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Route Registration
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/requests', requestRoutes);

// Root Route (Helps you check if the server is alive)
app.get('/', (req, res) => {
  res.send('Ali Halal Server is running... 🚀');
});

// MongoDB Connection
// It will look for MONGO_URI in your .env file first
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/alihalal';

mongoose.connect(dbURI)
  .then(() => console.log("✅ Ali Halal Database Connected Successfully!"))
  .catch(err => console.log("❌ DB Error:", err));

// PORT configuration
// Render will provide a process.env.PORT automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));