const dbconnect=require('../../database/db_connection')

const project_view_image = async (req, res) => {
    const { project_id } = req.params;
    console.log(project_id)
    try {
        const sqlQuery = 'SELECT key_name, caption, image FROM pref_project_view_image WHERE project_id = ?';
        
        dbconnect.query(sqlQuery, [project_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Unable to get image data", status: 'failed' });
            }

            
            
            // result.forEach(row => {
            //     if (!projectViewImages[row.key_name]) {
            //         projectViewImages[row.key_name] = {
            //             caption: row.caption,
            //             images: []
            //         };
            //     }
            //     projectViewImages[row.key_name].images.push(row.image);
            // });

            // const formattedResult = Object.keys(projectViewImages).map(key => ({
            //     key_name: key,
            //     caption: projectViewImages[key].caption,
            //     images: projectViewImages[key].images
            // }));

            return res.status(200).json({ status: 'success', data: result });
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", status: 'failed' });
    }
};



module.exports={project_view_image}