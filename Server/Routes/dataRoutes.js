const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createData,getData,deleteData}=require('../controllers/datacontroller'); //كل ما اعمل POST ,GET لازم اكتب اسم FUN هون
routes.post('/data',createData);
routes.get('/data',getData);
routes.delete('/data/:id',deleteData);


module.exports=routes;