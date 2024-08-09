const dbconnect=  require('../../database/db_connection');


const Project_AmenityData = async (req, res) => {
   
    const { Checked_value, project_id } = req.body; // Assuming Checked_value is passed in the body

    try {
        const sqlQuery = 'INSERT INTO  pref_project_amenity (project_id, amenity_name, amenity_id) VALUES (?, ?, ?)';
 
        const insertAmenities = async () => {
            for (const amenity of Checked_value) {
                const { name, amenityId } = amenity;
                await new Promise((resolve, reject) => {
                    dbconnect.query(sqlQuery, [project_id, name, amenityId], (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    });
                });
            }
        };
 
        await insertAmenities();
 
        res.status(201).json({ message: "Amenities inserted successfully" });
    } catch (error) {
        console.error("Error inserting amenities:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports={Project_AmenityData};
