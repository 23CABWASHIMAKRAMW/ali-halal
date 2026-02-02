const express = require('express');
const router = express.Router();
// IMPORTANT: Ensure this matches your filename in server/models/
const Item = require('../models/Item'); 

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;