const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    file: { type: String, required: true },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
