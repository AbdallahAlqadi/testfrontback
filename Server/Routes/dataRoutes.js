const express = require('express');
const cors = require('cors');
const routes = express.Router();
const fileUpload = require('express-fileupload'); // Include the file upload middleware

const { createData, getData } = require('../controllers/datacontroller');

routes.use(cors()); // Enable CORS for all routes
routes.use(fileUpload()); // Use the file upload middleware

routes.post('/data', createData);
routes.get('/data', getData);

module.exports = routes;
