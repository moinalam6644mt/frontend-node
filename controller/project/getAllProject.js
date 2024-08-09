const dbconnect=require('../../database/db_connection')

const getUniqueProject = async (req, res) => {
    const project_id = req.params.id;

    try {
        const projectQuery = 'SELECT * FROM pref_project_details WHERE project_id = ?';
        const bhkQuery = 'SELECT bhk_type, unit, min_sqft, max_sqft,min_amt_per_sqft,max_amt_per_sqft FROM pref_bhk_type WHERE project_id = ?';
        const landmarkQuery = 'SELECT landmark_name, landmark_value, distance FROM pref_landmark_details WHERE project_id = ?';
        const imageQuery = 'SELECT doc_name, doc_image FROM pref_project_image WHERE project_id = ?';
        const amenityQuery='SELECT amenity_name FROM pref_project_amenity WHERE project_id = ?'
        const projectViewImageQuery='SELECT key_name,caption,image FROM pref_project_view_image WHERE project_id = ?'
        const floorPlanQuery='SELECT bhk_type,floor_plan_image FROM pref_bhk_type_floorplan WHERE project_id = ?'

        // Promisify the query to use async/await
        const query = (sql, params) => {
            return new Promise((resolve, reject) => {
                dbconnect.query(sql, params, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        const [projectResults, bhkResults, landmarkResults, imageResults,amenityResult,projectViewImageResult,floorPlanQueryResult] = await Promise.all([
            query(projectQuery, [project_id]),
            query(bhkQuery, [project_id]),
            query(landmarkQuery, [project_id]),
            query(imageQuery, [project_id]),
            query(amenityQuery,[project_id]),
            query(projectViewImageQuery,[project_id]),
            query(floorPlanQuery,[project_id])

        ]);

        if (projectResults.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Project not found' });
        }

        const projectDetails = {
            ...projectResults[0],
            bhk_types: bhkResults,
            landmarks: [],
            images: [],
            amenityResult // Assign the image results directly
        };

        const landmarks = {};
        const images={}
        const projectViewImages={}
        const floorPlanImage={}


        projectViewImageResult.forEach(row => {
            if (!projectViewImages[row.key_name]) {
                projectViewImages[row.key_name] = {
                    caption: row.caption,
                    images: []
                };
            }
            projectViewImages[row.key_name].images.push(row.image);
        });

        projectDetails.projectViewImages = Object.keys(projectViewImages).map(key => ({
            key_name: key,
            caption: projectViewImages[key].caption,
            images: projectViewImages[key].images
        }));

        floorPlanQueryResult.forEach(row => {
            if (!floorPlanImage[row.bhk_type]) {
                floorPlanImage[row.bhk_type] = [];
            }
            floorPlanImage[row.bhk_type].push({
                image: row.floor_plan_image
            });
        });

        projectDetails.floorPlanImage = Object.keys(floorPlanImage).map(key => ({
            bhk_type: key,
            images: floorPlanImage[key]
        }));

        landmarkResults.forEach(row => {
            if (!landmarks[row.landmark_name]) {
                landmarks[row.landmark_name] = [];
            }
            landmarks[row.landmark_name].push({
                landmark_value: row.landmark_value,
                distance: row.distance
            });
        });

        projectDetails.landmarks = Object.keys(landmarks).map(key => ({
            landmark_name: key,
            details: landmarks[key]
        }));

        imageResults.forEach(row=>{
            if (!images[row.doc_name]) {
                images[row.doc_name] = [];
            }
            images[row.doc_name].push({
                image: row.doc_image
                
            });
            projectDetails.images = Object.keys(images).map(key => ({
                doc_name: key,
                details: images[key]
            }));
        })

        return res.status(200).json({ status: 'success', data: projectDetails, url:'http://localhost/realestate/frontend-node/public/propertyImage/' });

    } catch (error) {
        return res.status(500).json({ status: 'failed', message: 'Internal server error', error: error.message });
    }
};



const getAllProject = async (req, res) => {
    try {
        const filters = req.query; // Assuming filters are passed as query parameters

        // Base query with aggregation to get the first image
        let baseQuery = `
            SELECT 
                pref_project_details.*,
                SUBSTRING_INDEX(GROUP_CONCAT(pref_master_image.image ORDER BY pref_master_image.image_id ASC), ',', 1) AS image
            FROM 
                pref_project_details 
            LEFT JOIN 
                pref_master_image 
            ON 
                pref_project_details.project_id = pref_master_image.project_id 
            WHERE 
                status = 1
        `;

        const queryParams = [];

        // Add filtering conditions
        if (filters.city_name) {
            baseQuery += ' AND city_name = ?';
            queryParams.push(filters.city_name);
        }
        if (filters.address) {
            baseQuery += ' AND address LIKE ?';
            queryParams.push(`%${filters.address}%`);
        }
        if (filters.project_type) {
            baseQuery += ' AND project_type = ?';
            queryParams.push(filters.project_type);
        }
        if (filters.project_for) {
            baseQuery += ' AND project_for = ?';
            queryParams.push(filters.project_for);
        }
        if (filters.possession_date) {
            if (filters.possession_date === 'completed') {
                baseQuery += ' AND possession_date < NOW()';
            }
            if (filters.possession_date === 'ongoing') {
                baseQuery += ' AND possession_date > NOW()';
            }
        }
        if (filters.developer_name) {
            baseQuery += ' AND developer_name LIKE ?';
            queryParams.push(`%${filters.developer_name}%`);
        }

        // Add GROUP BY clause
        baseQuery += ' GROUP BY pref_project_details.project_id';

        // Promisify the query to use async/await
        const query = (sql, params) => {
            return new Promise((resolve, reject) => {
                dbconnect.query(sql, params, (err, results) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        const projectResults = await query(baseQuery, queryParams);

        if (projectResults.length === 0) {
            return res.status(200).json({ status: 'success', data: projectResults, message: 'No projects found' });
        }

        return res.status(200).json({ status: 'success', data: projectResults, url: 'http://localhost/realestate/frontend-node/public/propertyImage/' });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ status: 'failed', message: 'Internal server error', error: error.message });
    }
};








module.exports={getUniqueProject,getAllProject}