const dbconnect = require("../../database/db_connection");

const getaminityName = async (req, res) => {
  try {
    const sql =
      "SELECT pref_amenity_names.name, pref_amenity_names.amenity_id, pref_amenities.image, pref_amenities.status FROM pref_amenity_names JOIN pref_amenities ON pref_amenity_names.amenity_id = pref_amenities.amenity_id WHERE pref_amenity_names.lang = 'en';";
    dbconnect.query(sql, (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, error: "failed to fetch data" });
      }
      res.status(200).json({ success: true, data: result });
    });
  } catch (error) {
    return res.status(501).json({ success: false, error: "Server error" });
  }
};

module.exports = { getaminityName };
