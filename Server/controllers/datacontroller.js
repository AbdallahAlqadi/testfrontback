const Data = require('../models/data');


//post
exports.createData = async (req, res) => {
    const { nameproduct, price, img } = req.body;

    try {
        // Create a new product object
        const newData = { nameproduct, price, img };
        // Log the new product data

        // Save the product to the database
        const dbdata = await Data.create(newData);

        res.status(201).json({ message: `Data created successfully`, data: dbdata });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: error.message });
    }
};





//get

exports.getData=async (req,res)=>{
    try{
        const showData=await Data.find();
    
          //معناها انه اظهرلي الناتج داخل TERMENAL وليس داخل INSPECT
        res.json(showData);
    }
    
    catch(error){
        res.status(500).json({error:error.message});
    }
    }
    



 

// delet

// تعديل اسم الدالة إلى deleteData
exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedData = await Data.findByIdAndDelete(id); // استخدم findByIdAndDelete للتحقق من الوجود

        if (!deletedData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully', deletedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};