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

// The third argument 'menuitems' forces Mongoose to use your actual collection
module.exports = mongoose.model('Item', itemSchema, 'menuitems');