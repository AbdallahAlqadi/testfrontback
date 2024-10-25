const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createOrder,getOrder}=require('../controllers/ordercontroller'); 
 routes.post('/order',createOrder);
 routes.get('/order',getOrder);



module.exports=routes;