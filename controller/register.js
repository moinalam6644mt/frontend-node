const bcrypt = require('bcryptjs');
const dbconnect = require('../database/db_connection');

const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/temp');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}).single('image');

const logo_upload = async (req, res) => {
    const { member_id } = req.params;
    
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ success: false, message: 'File upload failed', error: err.message });
        }

        try {
            const image = req.file ? req.file.filename : null;

            if (!image) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            const sql = 'UPDATE pref_member SET logo = ? WHERE member_id = ?';
            console.log('Executing SQL query:', sql, 'with values:', [image, member_id]);
            
            dbconnect.query(sql, [image, member_id], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).send({ success: false, message: 'Unable to upload logo' });
                }

                const url = `http://localhost/realestate/frontend-node/public/temp/${image}`;
                console.log('File uploaded and database updated:', { file: req.file, url });

                return res.status(200).json({ 
                    success: true, 
                    message: 'Logo uploaded successfully',
                    data: {
                        file: req.file,
                        url
                    }
                });
            });
            
        } catch (error) {
            console.error('Error during logo upload:', error);
            return res.status(500).json({ success: false, message: 'Failed to upload logo' });
        }
    });
};

const get_logo = async (req, res) => {
    const { member_id } = req.params;

    try {
        const sql = "SELECT logo FROM pref_member WHERE member_id = ?";
        dbconnect.query(sql, [member_id], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send({ success: false, message: "Query execution failed" });
            }

            if (result.length > 0) {
                return res.status(200).json({
                    success: true,
                    result: result[0],
                    path: 'http://localhost/realestate/frontend-node/public/temp/'
                });
            } else {
                return res.status(404).json({ success: false, message: "Member not found" });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};




// Function to handle user registration
const register = async (req, res) => {
    try {

        const { password, member_name, member_email, phone_number, user_type } = req.body;


        if (!member_name) {
            return res.status(400).send({
                success: false,
                message: 'Name is required'
            });
        } else if (!member_email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required'
            });
        } else if (!phone_number) {
            return res.status(400).send({
                success: false,
                message: 'Phone number is required'
            });
        } else if (!password) {
            return res.status(400).send({
                success: false,
                message: 'Password is required'
            });
        }

        // Check if user already exists in the pref_access_panel table
        const sqlCheck = "SELECT * FROM pref_access_panel WHERE access_user_email = ?";
        dbconnect.query(sqlCheck, [member_email], async (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send({ success: false, message: "Registration failed" });
            }

            if (rows.length > 0) {
                return res.status(400).send({ success: false, message: 'Email already exists' });
            }

                // Insert data into pref_member table
                const sqlCheck = "SELECT * FROM pref_access_panel WHERE access_user_email = ?";
        dbconnect.query(sqlCheck, [member_email], async (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send({ success: false, message: "Registration failed" });
            }

            if (rows.length > 0) {
                return res.status(400).send({ success: false, message: 'Email already exists' });
            }

            // Hash the password
            const saltRound = 10;
            const hash_password = await bcrypt.hash(password, saltRound);

            // Insert data into pref_member table
            const sqlInsertMember = "INSERT INTO pref_member (member_name, member_email, phone_number, user_type) VALUES (?, ?, ?, ?)";
            dbconnect.query(sqlInsertMember, [member_name, member_email, phone_number, user_type], async (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ success: false, error: "Registration failed in pref_member" });
                }

                const member_id = result.insertId;

                // Update access_user_id in pref_member table
                const sqlUpdateMember = "UPDATE pref_member SET access_user_id = ? WHERE member_id = ?";
                dbconnect.query(sqlUpdateMember, [member_id, member_id], (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ success: false, error: "Failed to update access_user_id in pref_member" });
                    }

                    // Insert user into pref_access_panel table
                    const sqlInsertAccessPanel = "INSERT INTO pref_access_panel (access_user_email, access_user_password, login_status, access_user_id) VALUES (?, ?, ?, ?)";
                    dbconnect.query(sqlInsertAccessPanel, [member_email, hash_password, 1, member_id], (err, result) => {
                        if (err) {
                            console.error('Error executing query:', err);
                            return res.status(500).json({ success: false, error: "Registration failed in pref_access_panel" });
                        }

                        return res.status(200).json({ success: true, message: "User registered successfully"});
                    });
                });
            });
        });
    });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ success: false, error: "Registration failed" });
    }
};

const get_register_data = async (req, res) => {
    try {
        const searchQuery = "SELECT * FROM pref_member";

        // Execute the SQL query to retrieve data from the database
        dbconnect.query(searchQuery, (err, rows) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to fetch data" });
            }

            // Send the retrieved data as JSON response
            res.status(200).json({ success: true, data: rows });
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return res.status(500).json({ success: false, error: "Failed to fetch data" });
    }
};

const get_unique_register_data = async (req, res) => {
    const {id} = req.params
    try {
        const sql = 'select * from pref_member where access_user_id =?'
        dbconnect.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to fetch data" });
            }
            if (result.length > 0) {
                const data = result[0]
                res.status(200).json({ data });

                //console.log(data.member_name,data.member_email,data.phone_number)
            }
            else {
                res.status(404).json({ error: "Image not found" });
            }
        }
        )
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



module.exports = { register, get_register_data, get_unique_register_data,logo_upload,get_logo };