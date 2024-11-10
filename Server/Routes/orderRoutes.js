const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createOrder,getOrder,deleteData}=require('../controllers/ordercontroller'); 
 routes.post('/order',createOrder);
 routes.get('/order',getOrder);
 routes.delete('/order',deleteData);



module.exports=routes;