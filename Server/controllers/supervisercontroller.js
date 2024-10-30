const Super = require('../models/super');


exports.createData = async (req, res) => {
    const { name, password} = req.body;

    try {
        // Create a new product object
        const newData = { name, password};
        // Log the new product data

        // Save the product to the database
        const dbdata = await Super.create(newData);

        res.status(201).json({ message: `Data created successfully`, data: dbdata });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: error.message });
    }
};


exports.getsuper=async (req,res)=>{
    try{
        const showSuper=await Super.find();
    
          //معناها انه اظهرلي الناتج داخل TERMENAL وليس داخل INSPECT
        res.json(showSuper);
    }
    
    catch(error){
        res.status(500).json({error:error.message});
    }
    }
    