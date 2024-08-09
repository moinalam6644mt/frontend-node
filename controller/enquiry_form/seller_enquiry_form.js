const dbconnect = require('../../database/db_connection');
const jwt = require('jsonwebtoken');

const seller_enquiry_details = (req, res) => {

    const { property_id } = req.params;
    console.log(property_id)

    const token = req.headers.authorization;
    console.log('Authorization Header:', token);

    if (!token) {
        return res.status(400).json({ message: 'Authorization header missing' });
    }

    const tokenSplit = token.split(' ')[1];
    console.log('Token:', tokenSplit);

    let decoded;
    try {
        decoded = jwt.decode(tokenSplit);
        console.log(decoded)
    } catch (error) {

        return res.status(400).json({ message: 'Invalid token' });
    }

    if (!decoded) {

        return res.status(400).json({ message: 'Invalid or expired token' });
    }


    req.user = decoded.data; // Attach the decoded user data to req.user

    const user_id = req.user.user_id
    console.log(user_id)

    try {
        const { name, email, mobile, message } = req.body
        sqlQuery = 'INSERT INTO pref_seller_enquiry_fom (user_id,property_id,name,email,phone,mesage) VALUES (?,?,?,?,?,?)';
        dbconnect.query(sqlQuery, [user_id, property_id, name, email, mobile, message], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "unable to post data into database", error: err })
            }

            return res.status(200).json({ status: "success", message: result })
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const get_all_enquiry_based_on_property = (req, res) => {
    const { property_id } = req.params;

    try {
        const sqlQuery = 'SELECT name,email,phone,mesage FROM `pref_seller_enquiry_fom` WHERE property_id=?'
        dbconnect.query(sqlQuery, [property_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "unable to data from database", error: err })
            }
            return res.status(200).json({ status: "success", message: result })
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const get_all_enquiry = (req, res) => {
    try {
        const sqlQuery = 'SELECT name,email,phone,mesage FROM pref_seller_enquiry_fom'
        dbconnect.query(sqlQuery, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "unable to get data from database", error: err })
            }
            return res.status(200).json({ status: "success", message: result })
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const get_all_enquiry_based_on_userId = (req, res) => {
    const { user_id } = req.params;

    try {
        const sqlQuery = 'SELECT property_id, name, email, phone, mesage FROM pref_seller_enquiry_fom WHERE user_id=?';
        dbconnect.query(sqlQuery, [user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Unable to get data from database", error: err });
            }
            if (result.length === 0) {
                return res.status(200).json({ message: "No record found" });
            }
            return res.status(200).json({ status: "success", message: result });
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = { seller_enquiry_details, get_all_enquiry_based_on_property, get_all_enquiry, get_all_enquiry_based_on_userId }