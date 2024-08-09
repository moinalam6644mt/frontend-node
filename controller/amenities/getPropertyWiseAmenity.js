const dbconnect = require('../../database/db_connection');

const getAmenity_PropertyWise = async (req, res) => {
    const { property_id } = req.params
    try {

        const sqlquery = 'SELECT pref_property_amenity.amenity_name FROM pref_property_amenity JOIN pref_chatbot_data ON pref_chatbot_data.property_id = pref_property_amenity.property_id WHERE pref_chatbot_data.property_id = ?'
        dbconnect.query(sqlquery, [property_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "error in getting emenities", error: err })
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "No amenity found for this property" });
            }
            return res.status(200).json({ status: 'success', data: result })
        })


    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

module.exports = { getAmenity_PropertyWise }