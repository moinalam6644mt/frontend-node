
const dbconnect = require('../../database/db_connection')

const util = require('util');


// Promisify the query method
const query = util.promisify(dbconnect.query).bind(dbconnect);

const insertProjectdata = async (parseData) => {
    try {
        const {
            city_name,
            society_name,
            locality,
            area,
            address,
            launched_date,
            developer_name,
            project_name,
            unit,
            project_description,
            tower,
            project_size,
            min_price,
            max_price,
            possession_date,
            project_amount,
            project_status,
            status
    
        } = parseData;
    
        const sqlQuery = 'INSERT INTO pref_project_details (city_name, society_name, locality, area, address, launched_date, developer_name, project_name, unit, project_description, tower, project_size, min_price, max_price, possession_date, project_amount, project_status, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
        const result = await query(sqlQuery, [
            city_name,
            society_name,
            locality,
            area,
            address,
            launched_date,
            developer_name,
            project_name,
            unit,
            project_description,
            tower,
            project_size,
            min_price,
            max_price,
            possession_date,
            project_amount,
            project_status,
            status
        ]);
    
        return result.insertId;
    } catch (error) {
        throw new Error(`Error inserting project data: ${error.message}`);
    }
};

const insertBhk_type = async (parseData, project_id) => {
    try {
        const { bhk_type } = parseData;
        console.log(bhk_type)

        const sqlQuery = 'INSERT INTO pref_bhk_type (project_id, bhk_type, unit, min_sqft, max_sqft,min_amt_per_sqft,max_amt_per_sqft) VALUES (?, ?, ?, ?, ?,?,?)';

        for (let bhk of bhk_type) {
            const { name, value } = bhk;
            await query(sqlQuery, [
                project_id,
                name,
                value.total_unit,
                value.min,
                value.max,
                value.min_price,
                value.max_price
                
            ]);
        }
    } catch (error) {
        throw new Error(`Error inserting bhk type: ${error.message}`);
    }
};

const insert_Bhk_floor_image = async (parseData, project_id) => {
    try {
        const { floor_plan } = parseData;
        //console.log(floor_plan)

        const sqlQuery = 'INSERT INTO pref_bhk_type_floorplan (project_id, bhk_type, floor_plan_image) VALUES (?, ?, ?)'

        for (let floor of floor_plan) {
            const {type,images}=floor;
            for(let img of images){
                await query(sqlQuery, [
                    project_id,
                    type,
                    img.filename
                ]);
            }

        }
    } catch (error) {
        throw new Error(`Error inserting bhk floor image: ${error.message}`);
    }

}

const insert_project_view_image = async (parsedata, project_id) => {
    try {
        const { gallery } = parsedata;
        const sqlQuery = 'INSERT INTO pref_project_view_image (project_id, key_name, caption,image) VALUES (?, ?, ?, ?)'

        for(let gal of gallery){
            const {type,images}=gal;
            for(const img of images){
                console.log(img)
                await query(sqlQuery,[project_id,type,img.caption,img.filename])
            }
        }
        
    } catch (error) {
        throw new Error(`Error inserting project view image: ${error.message}`);
    }
}

const insertLandmark = async (parseData, project_id) => {
    try {
        const { landmark } = parseData;
        const sqlQuery = 'INSERT INTO pref_landmark_details (project_id, landmark_name, landmark_value, distance) VALUES (?, ?, ?, ?)';

        for (let landmrk of landmark) {
            const { name, value } = landmrk;

            for (let val of value) {

                await query(sqlQuery, [
                    project_id,
                    name,
                    val.text,
                    val.distance
                ]);
            }
        }
    } catch (error) {
        throw new Error(`Error inserting project view image: ${error.message}`);
    }
};


const insertDocument = async (parseData, project_id) => {
    try {
        const { document } = parseData;
        const sqlQuery = 'INSERT INTO pref_project_image (project_id, doc_name, doc_image) VALUES (?, ?, ?)';

        document.map((doc) => {
            const { type, images } = doc;
            images.map((img) => {
                query(sqlQuery, [
                    project_id,
                    type,
                    img.filename
                ])

            })
        })
    } catch (error) {
        throw new Error(`Error inserting project view image: ${error.message}`);
    }
};

const insterMasterImage=async(parseData,project_id)=>{
    try {
        const { master_image}=parseData
        const sqlQuery = 'INSERT INTO pref_master_image (project_id,image) VALUES (?, ?)';
            master_image.map((img) => {
                query(sqlQuery, [
                    project_id,
                    img
                ])

            })
        

    } catch (error) {
        throw new Error(`Error inserting master Image: ${error.message}`);
    }
}



const project_details = async (req, res) => {
    try {
        const { key_data } = req.body;
        const parseData = JSON.parse(key_data);
        console.log(parseData)
        console.log("dsfdfdfd")

        const project_id = await insertProjectdata(parseData);
        await insertBhk_type(parseData, project_id)
        await insertLandmark(parseData, project_id)
        await insertDocument(parseData, project_id)
        await insert_Bhk_floor_image(parseData, project_id)
        await insert_project_view_image(parseData, project_id)
        await insterMasterImage(parseData,project_id)

        return res.status(200).json({
            message: "Successfully posted the data",
            data: parseData,
            url: 'http://localhost/realestate/frontend-node/public/propertyImage'

        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = { project_details };


