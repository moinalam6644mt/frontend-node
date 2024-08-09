const dbconnect=require('../../database/db_connection')

const deleteChatDetails = async (req, res) => {
    const { propperty_id } = req.params;
    try {
        const sqlquery = "DELETE FROM pref_chatbot_data WHERE property_id = ?";
        dbconnect.query(sqlquery, [propperty_id], (error, result) => {
            if (error) {
                res.status(500).json({ success: false, error: "Falied to delete account" })
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: "Account not found" });
            }
            res.status(200).json({ success: true, message: "Account deleted successfully", data: result })
        })
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ success: false, error: "Falied to delete account" });
    }

}


module.exports=deleteChatDetails