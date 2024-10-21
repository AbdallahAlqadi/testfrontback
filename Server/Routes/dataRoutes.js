const express = require('express');
const cors = require('cors');
const routes = express.Router();
require('dotenv').config();

const { createData, getData } = require('../controllers/datacontroller'); 

routes.post('/data', createData); // سيتم استخدام upload middleware هنا
routes.get('/data', getData);

module.exports = routes;
