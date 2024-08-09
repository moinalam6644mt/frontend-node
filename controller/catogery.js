const dbconnect = require('../database/db_connection');


const catogery_name = async (req, res) => {
    try {
        const searchQuery = "SELECT name, id FROM pref_property_type_category_names WHERE lang != 'ar'";
        dbconnect.query(searchQuery, (err, result) => {

            console.log(result)
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to fetch data" });
            }

            // Send the retrieved data as JSON response
            res.status(200).json({ success: true, data: result });
            //return console.log(result.id);
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return res.status(500).json({ success: false, error: "Failed to fetch data" });
    }
}

const property_type = async (req, res) => {
    try {

        //console.log(req.params)
        //res.send("test params")
        const { id } = req.params;
        // SQL query to fetch data from the second table based on the ID from the first table
        const searchQuery = `SELECT name FROM pref_property_type INNER JOIN pref_property_type_names ON pref_property_type.id=pref_property_type_names.id WHERE pref_property_type.category_id=? AND pref_property_type_names.lang!='ar'; `;

        dbconnect.query(searchQuery, [id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, error: "Failed to fetch data" });
            }

            // Send the retrieved data as JSON response
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return res.status(500).json({ success: false, error: "Failed to fetch data" });
    }
}

module.exports = { catogery_name, property_type };
