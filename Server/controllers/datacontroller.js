const Data = require('../models/Data'); // تأكد من أن مسار النموذج صحيح
const fs = require('fs');
const path = require('path');

exports.createData = async (req, res) => {
    const { fileName } = req.body; // استلام اسم الملف
    const file = req.files.file; // استخدم middleware مثل express-fileupload أو multer لاستلام الملفات

    // تخزين الملف في مسار محدد
    const filePath = path.join(__dirname, '../uploads', fileName); // تأكد من وجود مجلد uploads
    fs.writeFileSync(filePath, file.data); // حفظ الملف على الخادم

    // تخزين البيانات في MongoDB
    const newData = new Data({ title: fileName, file: filePath });
    await newData.save();

    // استرجاع جميع الملفات من MongoDB
    const files = await Data.find();
    const result = files.map(({ title, file }) => ({
        fileName: title,
        fileUrl: file,
    }));

    res.json(result); // إرسال الملفات مع الأسماء إلى الواجهة الأمامية
};

exports.getData = async (req, res) => {
    const files = await Data.find();
    const result = files.map(({ title, file }) => ({
        fileName: title,
        fileUrl: file,
    }));
    res.json(result);
};
