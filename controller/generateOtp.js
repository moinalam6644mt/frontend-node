const otpGenerator = require('otp-generator');
const dbconnect = require('../database/db_connection');

const generateOtp = async(req, res) => {
    try {
        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        console.log(otp);

        // Insert OTP into database
        const sqlInsert = "INSERT INTO pref_profile_verify_token (otp) VALUES (?)"; 
        dbconnect.query(sqlInsert, [otp], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to generate otp"     });
            }
            // Send success response after inserting OTP
            return res.status(200).json({ success: true, message: "Otp sent successfully" ,data:{otp:otp}});
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ success: false, error: "Failed to generate OTP" });
    }
};

const verifyOtp = (req, res) => {
    try {
        const { otp } = req.body; 

        // Query the database to retrieve the OTP
        const sqlSelect = "SELECT * FROM pref_profile_verify_token WHERE otp = ?";
        dbconnect.query(sqlSelect, [otp], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to verify OTP" });
            }

            // Check if the OTP exists in the database
            if (result.length === 0) {
                return res.status(400).json({ success: false, error: "Invalid OTP" });
            }

            // Delete the OTP from the database
            const sqlDelete = "DELETE FROM pref_profile_verify_token WHERE otp = ?";
            dbconnect.query(sqlDelete, [otp], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ success: false, error: "Failed to verify OTP" });
                }

                // Send success response
                return res.status(200).json({ success: true, message: "OTP verified successfully" });
            });
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, error: "Failed to verify OTP" });
    }
};

module.exports = { generateOtp, verifyOtp };
