const dbconnect = require('../../database/db_connection');
const jwt = require('jsonwebtoken');

const get_property_details_based_on_userType_agent = async (req, res) => {
    const { user_id } = req.params;

    try {
        const sqlQuery = 'SELECT pref_chatbot_data.*,pref_member.user_type FROM pref_chatbot_data JOIN pref_member ON pref_chatbot_data.user_id = pref_member.access_user_id WHERE pref_member.user_type = "A" AND pref_member.access_user_id = ?';
        
        
        dbconnect.query(sqlQuery, [user_id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ status: 'Failed', message: "Data not found" });
            }

            if (result.length === 0) {
                return res.status(400).json({ message: "No Record Found" });
            }

            res.status(200).json({ status: 'Success', data: result });
        });
        
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal server error", error: error });
    }
};


module.exports= {get_property_details_based_on_userType_agent}