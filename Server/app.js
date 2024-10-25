const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
const signupRoutes = require('./routes/signupRoutes');
const orderRoutes = require('./routes/orderRoutes');


dotenv.config();
const app = express();
connectDB();
app.use(bodyParser.json());
app.use(cors());
app.use('/api',dataRoutes);

app.use('/api',signupRoutes);
app.use('/api',orderRoutes);


module.exports = app;