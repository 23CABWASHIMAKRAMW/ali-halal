const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    
    // This part is for debugging:
    if (items.length === 0) {
      return res.json({ 
        message: "Backend connected, but found 0 items.",
        checking_collection: Item.collection.name,
        checking_db: Item.db.name 
      });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;