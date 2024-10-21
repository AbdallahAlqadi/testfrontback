const Data = require('../models/data'); // Make sure the path is correct
const fs = require('fs').promises;
const path = require('path');

// Ensure uploads directory exists
const ensureUploadsDirectory = async () => {
    const dir = path.join(__dirname, '../uploads');
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
};

exports.createData = async (req, res) => {
    const { fileName } = req.body;
    const file = req.files.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded.' });

    const filePath = path.join(__dirname, '../uploads', fileName);
    
    try {
        await ensureUploadsDirectory();
        await fs.writeFile(filePath, file.data);

        const newData = new Data({ title: fileName, file: filePath });
        await newData.save();

        const files = await Data.find();
        const result = files.map(({ title, file }) => ({
            fileName: title,
            fileUrl: file,
        }));

        res.json(result);
    } catch (error) {
        console.error('Error saving file or data:', error);
        res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }
};

exports.getData = async (req, res) => {
    try {
        const files = await Data.find();
        const result = files.map(({ title, file }) => ({
            fileName: title,
            fileUrl: file,
        }));
        res.json(result);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'An error occurred while retrieving files.' });
    }
};
