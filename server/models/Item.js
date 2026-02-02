const mongoose = require('mongoose');

// This is the blueprint for every dish on your menu
const menuItemSchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true // e.g., Biryani, Grilled Items, Thai Cuisine
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// We use 'Item' as the model name and 'items' as the exact collection name in Atlas
module.exports = mongoose.model('Item', menuItemSchema, 'items');