const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {getsuper,createData}=require('../controllers/supervisercontroller'); 

  routes.get('/superviser',getsuper);
  routes.post('/superviser',createData);



module.exports=routes;