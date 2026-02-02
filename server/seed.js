const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

// Your Menu Data from requirements
const menuItems = [
  // Grilled Items
  { itemName: "Grilled Chicken Tikka", description: "Marinated chicken pieces grilled to perfection", price: 12.99, category: "Grilled Items" },
  { itemName: "Lamb Seekh Kebab", description: "Spiced minced lamb on skewers", price: 14.99, category: "Grilled Items" },
  { itemName: "Mixed Grill Platter", description: "Assorted grilled meats with sides", price: 24.99, category: "Grilled Items" },
  { itemName: "Grilled Fish Tandoori", description: "Fresh fish marinated in tandoori spices", price: 16.99, category: "Grilled Items" },
  
  // Indian Cuisine
  { itemName: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 13.99, category: "Indian Cuisine" },
  { itemName: "Lamb Rogan Josh", description: "Aromatic lamb curry with Kashmiri spices", price: 15.99, category: "Indian Cuisine" },
  { itemName: "Palak Paneer", description: "Spinach curry with cottage cheese", price: 11.99, category: "Indian Cuisine" },

  // Biryani
  { itemName: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken", price: 13.99, category: "Biryani" },
  { itemName: "Mutton Biryani", description: "Tender mutton pieces cooked with aromatic rice", price: 16.99, category: "Biryani" },
  { itemName: "Hyderabadi Dum Biryani", description: "Traditional slow-cooked biryani with boiled egg", price: 14.99, category: "Biryani" },

  // Beverages
  { itemName: "Mango Lassi", description: "Yogurt-based mango drink", price: 4.99, category: "Beverages" },
  { itemName: "Thai Iced Tea", description: "Sweet milk tea", price: 3.99, category: "Beverages" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");
    
    // Clear existing items so we don't have duplicates
    await MenuItem.deleteMany({}); 
    
    // Insert new items
    await MenuItem.insertMany(menuItems);
    console.log("✅ Success: All Ali Halal menu items have been uploaded!");
    
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
};

seedDB();