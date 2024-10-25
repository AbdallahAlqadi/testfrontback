const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    total: { type: Number, required: true },
    // Add any other fields you need for the order
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);
