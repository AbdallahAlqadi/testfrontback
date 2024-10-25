const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const { name, price, count,total } = req.body;

    try {
        // Create a new product object
        const newOrder = { name, price, count,total };
        // Log the new product data

        // Save the product to the database
        const dborder = await Order.create(newOrder);

        res.status(201).json({ message: `Data created successfully`, data: dborder });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: error.message });
    }
};