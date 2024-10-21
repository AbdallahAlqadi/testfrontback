const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const dataRoutes = require('./routes/dataRoutes');

dotenv.config();
const app = express();
connectDB();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', dataRoutes);




module.exports = app;