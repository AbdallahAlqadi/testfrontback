const Data = require('../models/data');

//creat:بستخدمها لما بدي  انزل بياناتي في داتابيز   او اضييف بيانات

//find:لما بدي اعمل read ل البيانات او احذفها او  تعديلها



//post
//ببعت Data ل backend
exports.createData = async (req, res) => {
    const { nameproduct, price, img } = req.body;

    try {
        const newData = { nameproduct, price, img };
        console.log(newData);
        
        const dbData = await Signup.create(newData);
        
        res.status(200).json({ message: `User created successfully: ${dbData}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
