const dbconnect = require('../database/db_connection');

const getCityName = async (req, res) => {
    try {
        const sql = 'SELECT * FROM pref_city_names WHERE lang!="ar"';
        dbconnect.query(sql, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to fetch data" });
            }
            res.status(200).json({ success: true, data: result })
        })
    } catch (error) {
        console.error('Error retrieving data:', error);
        return res.status(500).json({ success: false, error: "Failed to fetch data" });
    }

}


module.exports = getCityName