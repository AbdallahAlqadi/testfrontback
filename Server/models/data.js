const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    title: { type: String, required: true },
    file: { type: String, required: true }, // هذا لحفظ مسار الملف
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware لتحديث updatedAt عند الحفظ
dataSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
