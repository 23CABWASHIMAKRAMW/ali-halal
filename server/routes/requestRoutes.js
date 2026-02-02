const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// 1. POST: Triggered by the "Call Waiter" button
router.post('/call', async (req, res) => {
    try {
        const newRequest = new Request({ 
            tableNumber: req.body.tableNumber 
        });
        await newRequest.save();
        res.status(200).json({ message: "Waiter notified!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET: Triggered by Admin Dashboard to see active calls
router.get('/all', async (req, res) => {
    try {
        const requests = await Request.find(); // Find all pending requests
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE: Triggered when Admin clicks "DONE"
router.delete('/:id', async (req, res) => {
    try {
        await Request.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Request cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;