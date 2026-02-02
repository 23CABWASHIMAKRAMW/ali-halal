const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST: Place a new order
router.post('/place', async (req, res) => {
    try {
        const newOrder = new Order({
            phoneNumber: req.body.phoneNumber,
            tableNumber: req.body.tableNumber,
            items: req.body.items,
            totalAmount: req.body.totalAmount
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET: Fetch all orders for the Admin Dashboard
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to delete/complete an order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;