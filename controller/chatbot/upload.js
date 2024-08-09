const multer = require('multer');
const path = require("path");
const fs = require('fs');

//const dbconnect = require('../database/db_connection');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/temp');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


// const copyImages = async () => {
//   const tempFolderPath = path.join(__dirname, 'public', 'temp');
//   const propertyFolderPath = path.join(__dirname, 'public', 'property');

//   try {
//     // Read the contents of the temp folder
//     const files = await fs.readdir(tempFolderPath);

//     // Loop through each file in the temp folder
//     for (const file of files) {
//       const filePath = path.join(tempFolderPath, file);
//       const targetPath = path.join(propertyFolderPath, file);

//       // Check if the file is a directory
      

//       // Copy the file from temp folder to property folder
//       await fs.copy(filePath, targetPath);
//     }

//     console.log('Images copied successfully.');
//   } catch (error) {
//     console.error('Error copying images:', error);
//   }
// };

// Call the function to copy images when needed



const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}).array('images'); // Field name should match the name attribute in the HTML form and allow up to 10 images

const upload_file = async (req, res,next) => {

  upload(req, res, async function (err) {
     if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ message: 'Unknown error occurred', error: err });
    }

    if (!req.files || req.files.length === 0) {
      
      return res.status(400).json({ message: 'No files uploaded' });

    }

    const filesInfo = [];
    const errorMessages = [];

    for (const file of req.files) {
      const extension = path.extname(file.originalname).toLowerCase();
      let fileType;
      const key=req.body.key
      const caption=req.body.caption
      

      try {
        if (key === 'exterior') {
          if (['.jpg', '.jpeg', '.png', '.jfif', '.pdf'].includes(extension)) {
            fileType = key;
            
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif', '.pdf' are allowed for Exterier_view");
            continue;
          }
        } else if (key === "living") {
          if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
            fileType = key;
            
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for Livingroom");
            continue;
          }
        } else if (key === "bedroom") {
          if (['.jpg', '.jpeg', '.png', '.jfif,','.pdf'].includes(extension)) {
            fileType = key;
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for Bedroom");
            continue;
          }
        } else if (key === "bathroom") {
          if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
            fileType = key;
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for bathroom");
            continue;
          }
        } else if (key === "balcony") {
          if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
            fileType = key;
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif' ,'.pdf'are allowed for balcony");
            continue;
          }
        } else if (key === "floor") {
          if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
            fileType = key;
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for floor");
            continue;
          }
        } else if (key === "master") {
          if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
            fileType = key;
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for master");
            continue;
          }
        }else if (key === "location") {
            if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
              fileType = key;
            } else {
              errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif' ,'.pdf' are allowed for location");
              continue;
            }
           } else if (key === "common") {
              if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
                fileType = key;
              } else {
                errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for common");
                continue;
              }
             
            } else if (key === "washroom") {
              if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
                fileType = key;
              } else {
                errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for washroom");
                continue;
              }
            } else if (key === "site") {
              if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
                fileType = key;
              } else {
                errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for site");
                continue;
              }
              
           } else if (key === "other") {
              if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
                fileType = key;
              } else {
                errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for other");
                continue;
              }

          
        }else if (key === "kitchen") {
          if (['.jpg', '.jpeg', '.png', '.jfif','.pdf'].includes(extension)) {
            fileType = key;
          } else {
            errorMessages.push("only '.jpg', '.jpeg', '.png', '.jfif','.pdf' are allowed for kitchen");
            continue;
          }
        } 
        else {
          
            errorMessages.push("Choose tab to upload image");
        }

        filesInfo.push({
          url: `http://localhost/realestate/frontend-node/public/temp/${file.filename}`,
          originalname: file.originalname,
          filename: file.filename,
          fileType: key,
          caption:caption
        });
        // copyImages()

      } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({ success: false, message: "Error in uploading file" });
      }
    }

    if (errorMessages.length > 0) {
      return res.status(400).json({ success: false, message: errorMessages.join(', ') });
    }

    

    // Respond with success message and filesInfo
    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: filesInfo
    });

   
  });
};





module.exports = upload_file;
