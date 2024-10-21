const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nameproduct: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true }
});

const Data = mongoose.model('data', dataSchema);

module.exports = Data;
