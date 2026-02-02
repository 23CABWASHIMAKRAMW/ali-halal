const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  tableNumber: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);