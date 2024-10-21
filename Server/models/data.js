
const mongoose=require('mongoose')

//انه اي user بدي اضيفه لازم يحتوي على username,phone
const dataSchema=new mongoose.Schema({
    nameproduct:{type:String,required:true},
    price:{type:Number,required:true,unique: true},
    img:{type:String,required:true}

})

const Data=mongoose.model('data',dataSchema);

module.exports=Data;