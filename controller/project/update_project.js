const dbconnect = require('../../database/db_connection');
const util = require('util');

// Promisify the query method
const query = util.promisify(dbconnect.query).bind(dbconnect);

const update_project_details = async (req, res) => {
    const { project_id } = req.params;

    if (!project_id) {
        return res.status(400).json({ message: 'Project id is required' });
    }

    const updates = { ...req.body };
    const bhk_types = updates.bhk_types || [];
    const landmarks = updates.landmarks || [];
    
    // Remove bhk_types and landmarks from the update object
    delete updates.bhk_types;
    delete updates.landmarks;

    // Handle project details update
    try {
        // Update the Project details if there are any updates
        if (Object.keys(updates).length > 0) {
            const updateKeys = Object.entries(updates).map(([key]) => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(project_id);

            const sqlQuery = `UPDATE pref_project_details SET ${updateKeys} WHERE project_id = ?`;
            await query(sqlQuery, values);
        }

        // Update or insert BHK types
        if (bhk_types.length > 0) {
            const checkBhkQuery = 'SELECT * FROM pref_bhk_type WHERE project_id = ?';
            const existingBhk = await query(checkBhkQuery, [project_id]);
            const existingBhkTypes = existingBhk.map(bhk => bhk.bhk_type);

            for (let bhk of bhk_types) {
                const { bhk_type, unit, min_sqft, max_sqft } = bhk;

                if (existingBhkTypes.includes(bhk_type)) {
                    // Update existing BHK type
                    const sqlQuery = 'UPDATE pref_bhk_type SET unit = ?, min_sqft = ?, max_sqft = ? WHERE project_id = ? AND bhk_type = ?';
                    await query(sqlQuery, [unit, min_sqft, max_sqft, project_id, bhk_type]);
                } else {
                    // Insert new BHK type
                    const sqlQuery = 'INSERT INTO pref_bhk_type (project_id, bhk_type, unit, min_sqft, max_sqft) VALUES (?, ?, ?, ?, ?)';
                    await query(sqlQuery, [project_id, bhk_type, unit, min_sqft, max_sqft]);
                }
            }
        }

        // Update or insert landmarks
        if (landmarks.length > 0) {
            // Delete existing landmarks for the project
            const deleteLandmarkQuery = 'DELETE FROM pref_landmark_details WHERE project_id = ?';
            await query(deleteLandmarkQuery, [project_id]);

            // Insert new landmarks
            const insertLandmarkQuery = 'INSERT INTO pref_landmark_details (project_id, landmark_name, landmark_value, distance) VALUES (?, ?, ?, ?)';
            for (let landmrk of landmarks) {
                const { landmark_name, details } = landmrk;
                for (let detail of details) {
                    const { landmark_value, distance } = detail;
                    await query(insertLandmarkQuery, [project_id, landmark_name, landmark_value, distance]);
                }
            }
        }

        return res.status(200).json({ success: true, message: 'Updated successfully' });
    } catch (error) {
        console.error('Error updating database:', error);
        return res.status(500).json({ message: 'Database update failed', error: error.message });
    }
};

module.exports = { update_project_details };
