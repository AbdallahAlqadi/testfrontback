const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String},
    price: { type: Number },
    count: { type: Number },
    total: { type: Number},
    // Add any other fields you need for the order
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);
