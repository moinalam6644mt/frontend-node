
const dbconnect = require('../../database/db_connection')




const update_chatbot_details = async (req, res) => {
    const { property_id } = req.params;

    if (!property_id) {
        return res.status(400).json({ message: 'property_id is required' });
    }

    const updates = Object.entries(req.body).filter(([key, value]) => key !== 'updatedGallery');
    const galleryUpdates = req.body.updatedGallery || [];

    if (updates.length === 0 && galleryUpdates.length === 0) {
        return res.status(400).json({ message: 'No valid keys to update' });
    }

    try {
        // Update the chatbot details if there are any updates
        if (updates.length > 0) {
            const getKey = updates.map(([key, value]) => `${key} = ?`).join(', ');
            const values = updates.map(([key, value]) => value);
            values.push(property_id);

            const sqlQuery = `UPDATE pref_chatbot_data SET ${getKey} WHERE property_id = ?`;

            dbconnect.query(sqlQuery, values, (err, result) => {
                if (err) {
                    console.error('Error updating pref_chatbot_data:', err);
                    return res.status(500).json({ message: 'Database update failed', error: err });
                }
                // console.log(result);
            });
        }

        if (galleryUpdates.length > 0) {
            // Delete existing images and keys
            const sqlDeleteImage = 'DELETE FROM pref_image WHERE property_id = ?';
            const sqlDeleteKey = 'DELETE FROM pref_key_name WHERE property_id = ?';

            dbconnect.query(sqlDeleteImage, [property_id], (err, result) => {
                if (err) {
                    console.error('Error deleting images:', err);
                    return res.status(500).json({ status: 'failed', message: 'Unable to delete images' });
                }
                // console.log("Images deleted successfully");
            });

            dbconnect.query(sqlDeleteKey, [property_id], (err, result) => {
                if (err) {
                    console.error('Error deleting keys:', err);
                    return res.status(500).json({ status: 'failed', message: 'Unable to delete keys' });
                }
                // console.log("Keys deleted successfully");
            });

            // Insert new keys and images
            for (const gallery of galleryUpdates) {
                const {key_name, images } = gallery;

                // Insert key
                const sqlInsertKeyName = `INSERT INTO pref_key_name (key_name, property_id) VALUES (?, ?)`;
                dbconnect.query(sqlInsertKeyName, [key_name, property_id], (err, keyResult) => {
                    if (err) {
                        console.error('Error inserting key_name:', err);
                        return res.status(500).json({ status: 'failed', message: 'Unable to insert key_name' });
                    }
                    // console.log("Key Name inserted successfully");

                    const key_id = keyResult.insertId;

                    // Insert images
                    for (const image of images) {
                        const sqlInsertImage = `INSERT INTO pref_image (property_id, key_id, image, caption) VALUES (?, ?, ?, ?)`;
                        dbconnect.query(sqlInsertImage, [property_id, key_id, image.image, gallery.caption || ""], (err, imageResult) => {
                            if (err) {
                                console.error('Error inserting image:', err);
                                return res.status(500).json({ status: 'failed', message: 'Unable to insert image' });
                            }
                            // console.log("Image inserted successfully");
                        });
                    }
                });
            }
        }

        res.status(200).json({ status: 'success', message: 'Updated successfully' });
    } catch (error) {
        console.error('Error updating database:', error);
        res.status(500).json({ message: 'Database update failed', error });
    }
};

















module.exports = { update_chatbot_details }