const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/projectImage'); // Change this to your desired upload folder path
    },
    filename: (req, file, cb) => {
        
        cb(null, `${Date.now()}-${file.originalname}`); // Filename format with extension
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}).array('images'); // Use array for multiple files

const uploadProjectImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            
            return res.status(500).json({ message: 'Unknown error occurred', error: err.message });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const filesInfo = [];
        const errorMessages = [];

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.jfif'];

        for (const file of req.files) {
            const extension = path.extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                errorMessages.push(`Invalid file type: ${file.originalname}. Allowed types: ${allowedExtensions.join(', ')}`);
                continue;
            }

            filesInfo.push({
                url: `http://localhost/realestate/frontend-node/public/projectImage/${file.filename}`,
                originalname: file.originalname,
                filename: file.filename
            });
        }

        if (errorMessages.length > 0) {
            return res.status(400).json({ message: 'Some files were not uploaded', errors: errorMessages });
        }

        return res.status(200).json({ message: 'Files uploaded successfully', files: filesInfo });
    });
};

module.exports = {
    uploadProjectImage
};
