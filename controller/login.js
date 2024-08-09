
const dbconnect = require('../database/db_connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
require('dotenv').config()


function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}

const login = async (req, res) => {
    const { member_email, password} = req.body;

    // Validate email and password 
    if (!member_email) {
        return res.status(400).send({
            success: false,
            message: 'Email is required'
        });
    } else if (!password) {
        return res.status(400).send({
            success: false,
            message: 'Password is required'
        });
    }

    try {
        const sql = "SELECT * FROM pref_access_panel INNER JOIN pref_member ON pref_access_panel.access_user_id =  pref_member.access_user_id WHERE access_user_email = ?";
        dbconnect.query(sql, [member_email], async (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Login failed" });
            }

            if (result.length === 0) {
                console.log("User not found");
                return res.status(404).json({ success: false, message: "Invalid user" });
            }

            const user = result[0];


            const validPassword = await bcrypt.compare(password, user.access_user_password);
            if (!validPassword) {
                console.log("Invalid password");
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }

            console.log("Login successful");
            const data = {
                user_id: user.member_id,
                email: user.access_user_email, 
                name: user.member_name, 
                type: user.user_type, 
                logo: user.logo,
                number:user.phone_number
            }

            const token = jwt.sign({ data }, process.env.JWT_KEY, { expiresIn: '1h' });
            //console.log(user.member_id)

            return res.status(200).json({ success: true, message: "Login successful", token: token, data:data});
            //return res.status(200).json({ success: true, message: "Login successful" });


        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, error: "Login failed" });
    }
}
const sendPasswordResetEmail = async (user, otp) => {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'kadin.mccullough@ethereal.email',
                pass: 'HsG3HwzBzAUAQcuJX4'
            }
        });

        // Define email options
        let mailOptions = {
            from: 'kadin.mccullough@ethereal.email', // Sender email address
            to: user.access_user_email, // Recipient email address
            subject: 'Password Reset Request', // Email subject
            html: `<p>Hello ${user.access_user_email},</p>
                   <p>We received a request to reset your password. Please use the following OTP (One Time Password) to reset your password:</p>
                   <h3>${otp}</h3>`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("Password reset email sent");
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

const forget_password = async (req, res) => {
    const { access_user_email } = req.body;

    // Validate email
    if (!access_user_email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const sql = "SELECT * FROM pref_access_panel WHERE access_user_email = ?";
        dbconnect.query(sql, [access_user_email], async (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to reset password" });
            }

            if (result.length === 0) {
                console.log("User not found");
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const user = result[0];
            console.log(user);

            // Generate OTP
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

            // Send password reset email
            await sendPasswordResetEmail(user, otp);

            return res.status(200).json({ success: true, message: "Password reset email sent", data: { otp: otp } });
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ success: false, error: "Failed to reset password" });
    }
};
// Function to update user password
const updatePassword = async (req, res) => {
    const { password } = req.body;
    const { userid } = req.params
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        const sql = "UPDATE pref_access_panel SET access_user_password = ? WHERE access_user_id = ?";
        dbconnect.query(sql, [hashedPassword, userid], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to update password" });
            }
            res.status(200).json({ success: true, data: result, message: "password updated successfully" });
        });

    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ success: false, error: "Failed to update password" });
    }
}

const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const sqlquery = "DELETE FROM pref_access_panel WHERE access_user_id = ?";
        dbconnect.query(sqlquery, [id], (error, result) => {
            if (error) {
                res.status(500).json({ success: false, error: "Falied to delete account" })
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: "Account not found" });
            }
            res.status(200).json({ success: true, message: "Account deleted successfully", data: result })
        })
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ success: false, error: "Falied to delete account" });
    }

}

const uniqueUser = async (req, res) => {
    verifyToken(req, res, async () => {
        const { user_id } = req.params;
        console.log(user_id)
        try {
            const sql = 'SELECT * FROM pref_access_panel INNER JOIN pref_member ON pref_access_panel.access_user_id =  pref_member.access_user_id WHERE member_id = ?';
            dbconnect.query(sql, [user_id], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ success: false, error: "Failed to fetch data" });
                }

                if (result.length > 0) {
                    const data = result[0];
                    res.status(200).json({ success: true, data: data });
                } else {
                    res.status(404).json({ success: false, message: "User not found" });
                }
            });
        } catch (error) {
            console.error("Database query error:", error);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    });
}

module.exports = { login, forget_password, updatePassword, deleteAccount, uniqueUser, verifyToken }
