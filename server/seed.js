const mongoose = require('mongoose');

// 1. YOUR CONNECTION STRING (Make sure /ali_halal is before the ?)
const MONGO_URI = "mongodb+srv://your_username:your_password@cluster0.mongodb.net/ali_halal?retryWrites=true&w=majority";

// 2. THE SCHEMA (Must match index.js)
const itemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  price: Number,
  category: String,
  isAvailable: { type: Boolean, default: true }
}, { collection: 'items' });

const Item = mongoose.model('Item', itemSchema);

const seedData = [
  { itemName: "Mango Lassi", description: "Fresh mango yogurt drink", price: 120, category: "Drinks" },
  { itemName: "Chicken Biryani", description: "Spicy aromatic rice with chicken", price: 350, category: "Main Course" },
  { itemName: "Garlic Naan", description: "Soft bread with garlic butter", price: 60, category: "Bread" },
  { itemName: "Mutton Seekh Kabab", description: "Grilled minced mutton", price: 400, category: "Starters" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    // Clear existing items so you don't get duplicates
    await Item.deleteMany({});
    console.log("🗑️ Old items cleared.");

    // Insert new items
    await Item.insertMany(seedData);
    console.log("🥗 Menu items added successfully!");

    mongoose.connection.close();
    console.log("🔌 Connection closed.");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  }
};

seedDB();