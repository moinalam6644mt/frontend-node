
const dbconnect = require('../../database/db_connection');
const jwt = require('jsonwebtoken');

const insertChatbotDataForFlat = async (parsedData, user_id) => {

    const {
        prop_type1, prop_type2, prop_type3, city_name, society_name,
        locality, area, address, bedroom,balcony,
        floor_no, total_floor_no, bathroom, kitchen, furnishing_status,
        processing_status, expected_amt, booking_amt, carpet_area, super_area, developer_detail, propject_details, facing, ownership_details,tenant_preffered,availibility,construction_age
    } = parsedData;

    const chatbotSqlQueryforFlat = `INSERT INTO pref_chatbot_data 
        (user_id,property_for, property_type, property_type_for, city_name, society_name, locality, area, address, bedroom, 
        balcony, floor_no, total_floor_no, bathroom,kitchen,furnishing_status, processing_status, 
        expected_amt, booking_amt, carpet_area, super_area, developer_detail, propject_details, facing, ownership_details,tenent_preffered,availibality,construction_age) VALUES 
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    return new Promise((resolve, reject) => {
        dbconnect.query(chatbotSqlQueryforFlat, [
            user_id,prop_type1, prop_type2, prop_type3, city_name, society_name, locality, area, address, bedroom,
            balcony,floor_no, total_floor_no, bathroom,kitchen,
            furnishing_status, processing_status, expected_amt, booking_amt, carpet_area, super_area, developer_detail, propject_details, facing, ownership_details,tenant_preffered,availibility,construction_age
        ], (error, chatResult) => {
            if (error) {
                return reject(error);
            }
            resolve(chatResult.insertId);
        });
    });
};


const insertChatbotDataForCommercial = async (parsedData, user_id) => {
    console.log(parsedData)
    const {
        prop_type1, prop_type2, prop_type3, city_name, locality, land_zone, businesses,floor_no,total_floor_no, cabin_room, modify_interior,
        personal_washroom, washroom_no, assured_return, cafeteria, carpet_area,
        super_area,lease_out, monthly_rent, security_amt, maintanance_charge,ownership_details,
    } = parsedData;

    const chatbotSqlQueryforCommercial = `INSERT INTO pref_chatbot_data 
    (user_id, property_for, property_type, property_type_for, city_name, locality, land_zone, businesses, floor_no, total_floor_no, cabin_room, modify_interior, personal_washroom, washroom_no, assured_return, cafeteria, carpet_area, super_area, lease_out, monthly_rent, security_amt, maintanance_charge,ownership_details) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;


    return new Promise((resolve, reject) => {
        dbconnect.query(chatbotSqlQueryforCommercial, [
            user_id,prop_type1, prop_type2, prop_type3, city_name, locality, land_zone, businesses,floor_no,total_floor_no,cabin_room, modify_interior, personal_washroom, washroom_no, assured_return, cafeteria, carpet_area, super_area, lease_out, monthly_rent, security_amt, maintanance_charge,ownership_details
        ], (error, chatResult) => {
            if (error) {
                return reject(error);
            }
            resolve(chatResult.insertId);
        });
    });
};

const insertKeyAndImages = async (gallery, property_id) => {
    const memberCheckQuery = `SELECT * FROM pref_key_name WHERE property_id = ?`;

    const memberCheckResult = await new Promise((resolve, reject) => {
        dbconnect.query(memberCheckQuery, [property_id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
    
    for (const section of gallery) {
        console.log(gallery)
        const { key, value, images } = section;

        const keyCheckQuery = `SELECT * FROM pref_key_name WHERE key_name = ?`;

        const keyCheckResult = await new Promise((resolve, reject) => {
            dbconnect.query(keyCheckQuery, [key], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });

        if (keyCheckResult.length > 0 && memberCheckResult.length > 0) {
            console.log("Key already exists:", key);
            throw new Error('Key already exists');
        }

        const keyInsertQuery = `INSERT INTO pref_key_name (key_name, property_id) VALUES (?, ?)`;

        const keyInsertResult = await new Promise((resolve, reject) => {
            dbconnect.query(keyInsertQuery, [key, property_id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });

        const key_id = keyInsertResult.insertId;

        for (const img of images) {
            console.log(img)
            const { filename } = img;
            console.log(img)
            const insertImageQuery = `INSERT INTO pref_image (key_id, property_id, caption, image) VALUES (?, ?, ?, ?)`;

            await new Promise((resolve, reject) => {
                dbconnect.query(insertImageQuery, [key_id, property_id, value, filename], (error, imageResult) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve({
                        success: true, message: "Image data inserted successfully", data: imageResult
                    });
                });
            });

            console.log("Image data inserted successfully");
        }
    }
};

const insertSize = async (inputfieldvalue, property_id) => {
    const { bedroom_size, balcony_size, bathroom_size, kitchen_size, cabin_size, washroom_size } = inputfieldvalue;
    
    const insertSizeQuery = `INSERT INTO pref_size (property_id, key_name, name, height, width) VALUES (?, ?, ?, ?, ?)`;

    const insertSizes = async (sizes, key_name) => {
        for (const size of sizes) {
            console.log(size);
            const [name, dimensions] = Object.entries(size)[0];
            const { height, width } = dimensions;
            await new Promise((resolve, reject) => {
                dbconnect.query(insertSizeQuery, [property_id, key_name, name, height, width], (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
        }
    };

    if (bedroom_size) await insertSizes(bedroom_size, 'bedroom');
    if (balcony_size) await insertSizes(balcony_size, 'balcony');
    if (bathroom_size) await insertSizes(bathroom_size, 'bathroom');
    if (kitchen_size) await insertSizes(kitchen_size, 'kitchen');
    if (cabin_size) await insertSizes(cabin_size, 'cabin');
    if (washroom_size) await insertSizes(washroom_size, 'washroom');
};




const chatbot_details = async (req, res) => {
    const token = req.headers.authorization;
    //console.log('Authorization Header:', token);
    
    if (!token) {
        return res.status(400).json({ message: 'Authorization header missing' });
    }

    const tokenSplit = token.split(' ')[1];
    console.log('Token:', tokenSplit);

    let decoded;
    try {
        decoded = jwt.decode(tokenSplit);
        console.log(decoded)
    } catch (error) {
        //console.log('JWT Decode Error:', error);
        return res.status(400).json({ message: 'Invalid token' });
    }

    if (!decoded) {
        //console.log('Decoded Token is null');
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    //console.log('Decoded Token:', decoded);
    req.user = decoded.data; // Attach the decoded user data to req.user

    try {
        const { key_data } = req.body;
        console.log(key_data)
        const parsedData = JSON.parse(key_data);
        
        
        const user_id = req.user.user_id; // Extract user_id from the decoded token
        
        
        let property_id; 

        if (parsedData.prop_type3 === 'Flats') {
            property_id = await insertChatbotDataForFlat(parsedData, user_id);
            console.log('Property ID for Flats:', property_id);
        } else {
            property_id = await insertChatbotDataForCommercial(parsedData, user_id);
            console.log('Property ID for Commercial:', property_id);
        }

        await insertKeyAndImages(parsedData.gallery, property_id);
        await insertSize(parsedData.inputfieldvalue, property_id)

        res.status(201).json({ message: "Data inserted successfully", data: parsedData, path: 'http://localhost/realestate/frontend-node/public/temp', property_id: property_id });
    } catch (error) {
        console.log("Internal Server Error: ", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { chatbot_details };




