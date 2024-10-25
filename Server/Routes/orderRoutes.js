const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createOrder}=require('../controllers/ordercontroller'); 
 routes.post('/order',createOrder);



module.exports=routes;