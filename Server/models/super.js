const mongoose = require('mongoose');

const superSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: Number, required: true }
});

const Super = mongoose.model('superviser', superSchema);

module.exports = Super;
