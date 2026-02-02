const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST a new review
router.post('/add', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ message: "Review saved!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all reviews
router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;