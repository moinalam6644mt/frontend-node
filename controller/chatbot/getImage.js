const dbconnect = require('../../database/db_connection')
const getAllImage = async (req, res) => {
    try {
        const { property_id } = req.params; // Corrected typo
        const sqlquery = `SELECT pref_image.image_id, pref_image.property_id, pref_image.key_id, pref_key_name.key_name, pref_image.caption, pref_image.image FROM pref_image INNER JOIN pref_key_name ON pref_image.key_id = pref_key_name.key_id WHERE pref_image.property_id = ?`;

        dbconnect.query(sqlquery, [property_id], (error, result) => {
            if (error) {
                return res.status(500).json({ success: false, error: "Failed to fetch details" });
            }
            return res.status(200).json({ success: true, data: result }); // Changed status code to 200
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get all images' });
    }
};

const getAllpropertyImage=async(req,res)=>{
    try {
        const sqlquery = `SELECT pref_image.image_id, pref_image.property_id, pref_image.key_id, pref_key_name.key_name, pref_image.caption, pref_image.image FROM pref_image INNER JOIN pref_key_name ON pref_image.key_id = pref_key_name.key_id`

        dbconnect.query(sqlquery, (error, result) => {
            if (error) {
                return res.status(500).json({ success: false, error: "Failed to fetch details" });
            }
            return res.status(200).json({ success: true, data: result }); // Changed status code to 200
        })
        
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get all images' });
    }
}


module.exports = {getAllImage,getAllpropertyImage};