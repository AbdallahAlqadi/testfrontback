const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const dataRoutes = require('./routes/dataRoutes');

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', dataRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
