const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  phoneNumber: String,
  tableNumber: String,
  items: [
    {
      itemName: String,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: { type: String, default: 'Cash' }, // New field
  isPaid: { type: Boolean, default: false },        // New field
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);