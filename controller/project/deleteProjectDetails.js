const dbconnect = require('../../database/db_connection');

const deleteProjectDetails = async (req, res) => {
    const { project_id } = req.params;
    if (!project_id) {
        return res.status(400).json({ success: false, error: "Project ID is required" });
    }
    try {
        const sqlQuery = `UPDATE pref_project_details SET status = '-1' WHERE project_id = ?`;
        dbconnect.query(sqlQuery, [project_id], (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ success: false, error: "Failed to delete project" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: "Project not found" });
            }
            res.status(200).json({ success: true, message: "Project deleted successfully", data: result });
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ success: false, error: "Failed to delete project" });
    }
};

module.exports = deleteProjectDetails;
