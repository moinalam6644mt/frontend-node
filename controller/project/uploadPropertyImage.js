const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/propertyImage'); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        
        cb(null, `${Date.now()}-${file.originalname}`); // Filename format with extension
    }
});

// Create the multer instance with storage configuration and file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}).array('images'); // Field name should match the name attribute in the HTML form

const uploadPropertyImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ message: 'Unknown error occurred', error: err.message });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const allowedExtensions = {
            'insurance_policy': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'sale_agreement': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'Property': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'mortgage_agreement': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'loan_agreement': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'property_insurance_policy': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'appraisal_report': ['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'lease_agreement':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            '1 BHK':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            '2 BHK':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            '3 BHK':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            '4 BHK':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            '5 BHK':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'exterior':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'interior':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'location':['.jpg', '.jpeg', '.png', '.jfif', '.pdf'],
            'other':['.jpg', '.jpeg', '.png', '.jfif', '.pdf']
        };

        const filesInfo = [];
        const errorMessages = [];

        for (const file of req.files) {
            const extension = path.extname(file.originalname).toLowerCase();
            const document = req.body.document;

            if (!allowedExtensions[document]) {
                errorMessages.push(`Unsupported document type: ${document}`);
                continue;
            }

            if (!allowedExtensions[document].includes(extension)) {
                errorMessages.push(`Invalid file type for ${document}. Allowed types: ${allowedExtensions[document].join(', ')}`);
                continue;
            }

            let fileInfo = {
                url: `http://localhost/realestate/frontend-node/public/propertyImage/${file.filename}`,
                originalname: file.originalname,
                filename: file.filename,
                fileType: document
            };

            // If the document type is exterior, interior, location, or other, add the caption
            if (['exterior', 'interior', 'location', 'other'].includes(document)) {
                const caption = req.body.caption;
                if (!caption) {
                    errorMessages.push(`Caption is required for document type: ${document}`);
                    continue;
                }
                fileInfo.caption = caption;
            }

            filesInfo.push(fileInfo);
        }

        if (errorMessages.length > 0) {
            return res.status(400).json({ message: 'Some files were not uploaded', errors: errorMessages });
        }

        return res.status(200).json({ message: 'Files uploaded successfully', files: filesInfo });
    });
};





module.exports = { uploadPropertyImage }