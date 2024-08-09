const dbconnect = require('../../database/db_connection');
const jwt = require('jsonwebtoken');
const get_all_property = async (req, res) => {
    try {
        const {
            property_for,
            property_type,
            property_type_for,
            city_name,
            expected_amt,
            monthly_rent,
            carpet_area,
            bedroom,
            furnishing_status,
            processing_status,
            sortBY,
            posted_since,
            posted_by,
            facing,
            ownership_details,
            bathroom,
            washroom_no,
            floor_no,
            cabin_room,
            cafeteria,
            super_area,
            page = 1,
            limit = 3,
        } = req.query;
        // Base SQL query
        let sqlchatbotData = `SELECT a.* FROM pref_chatbot_data as a 
        JOIN pref_member as m ON a.user_id = m.member_id 
        WHERE a.property_id>0`;
        let sqlParams = [];

        // Append filters if they are provided
        if (property_for) {
            sqlchatbotData += ` AND a.property_for = ?`;
            console.log(sqlchatbotData)
            sqlParams.push(property_for);
        }
        if (property_type) {
            sqlchatbotData += ` AND a.property_type = ?`;
            sqlParams.push(property_type);
        }
        if (property_type_for) {
            sqlchatbotData += ` AND a.property_type_for = ?`;
            sqlParams.push(property_type_for);
        }
        if (city_name) {
            sqlchatbotData += ` AND (a.city_name = ? OR a.locality = ? OR a.area = ? OR a.society_name= ? OR address=?)`;
            sqlParams.push(city_name, city_name, city_name, city_name, city_name);
        }

        if (monthly_rent) {
            if (monthly_rent === '500000 & Less') {
                sqlchatbotData += ` AND a.monthly_rent < 500000 `;
                sqlParams.push(monthly_rent);
            } else if (monthly_rent === '500000-1000000') {
                sqlchatbotData += ` AND a.monthly_rent > 500000 AND a.monthly_rent <= 1000000`;
                sqlParams.push(monthly_rent);
            } else if (monthly_rent === '1000000-2000000') {
                sqlchatbotData += ` AND a.monthly_rent > 1000000 AND a.monthly_rent <= 2000000`;
                sqlParams.push(monthly_rent);
            } else if (monthly_rent === '2000000-4000000') {
                sqlchatbotData += ` AND a.monthly_rent > 2000000 AND a.monthly_rent <= 4000000`;
                sqlParams.push(monthly_rent);
            } else if (monthly_rent === '4000000-8000000') {
                sqlchatbotData += ` AND a.monthly_rent > 4000000 AND a.monthly_rent <= 8000000`;
                sqlParams.push(monthly_rent);
            } else if (monthly_rent === '8000000-10000000') {
                sqlchatbotData += ` AND a.monthly_rent > 8000000 AND a.monthly_rent <= 10000000`;
                sqlParams.push(monthly_rent);
            } else if (monthly_rent === '10000000 & more') {
                sqlchatbotData += ` AND a.monthly_rent > 10000000`;
                sqlParams.push(monthly_rent);
            }
        }

        if (expected_amt) {
            if (monthly_rent === '5000 & Less') {
                sqlchatbotData += ` AND a.monthly_rent < 5000`;
                sqlParams.push(monthly_rent);
            } else if (expected_amt === '5000-10000') {
                sqlchatbotData += ` AND a.expected_amt > 5000 AND a.expected_amt <= 10000`;
                sqlParams.push(expected_amt);
            } else if (expected_amt === '10000-20000') {
                sqlchatbotData += ` AND a.expected_amt > 10000 AND a.expected_amt <= 20000`;
                sqlParams.push(expected_amt);
            } else if (expected_amt === '20000-40000') {
                sqlchatbotData += ` AND a.expected_amt > 20000 AND a.expected_amt <= 40000`;
                sqlParams.push(expected_amt);
            } else if (expected_amt === '40000-80000') {
                sqlchatbotData += ` AND a.expected_amt > 40000 AND a.expected_amt <= 80000`;
                sqlParams.push(expected_amt);
            } else if (expected_amt === '80000-100000') {
                sqlchatbotData += ` AND a.expected_amt > 80000 AND a.expected_amt <= 100000`;
                sqlParams.push(expected_amt);
            } else if (expected_amt === '100000 & more') {
                sqlchatbotData += ` AND a.expected_amt > 100000`;
                sqlParams.push(expected_amt);
            }

        }
        if (carpet_area) {
            if (carpet_area === '100-200') {
                sqlchatbotData += ` AND a.carpet_area > 100 AND a.carpet_area <= 200`;
                sqlParams.push(carpet_area);
            } else if (carpet_area === '200-400') {
                sqlchatbotData += ` AND a.carpet_area > 200 AND a.carpet_area <= 400`;
                sqlParams.push(carpet_area);
            } else if (carpet_area === '400-600') {
                sqlchatbotData += ` AND a.carpet_area > 400 AND a.carpet_area <= 600`;
                sqlParams.push(carpet_area);
            } else if (carpet_area === '600-800') {
                sqlchatbotData += ` AND a.carpet_area > 600 AND a.carpet_area <= 800`;
                sqlParams.push(carpet_area);
            } else if (carpet_area === '800-1000') {
                sqlchatbotData += ` AND a.carpet_area > 800 AND a.carpet_area <= 1000`;
                sqlParams.push(carpet_area);
            } else if (carpet_area === '1000-5000') {
                sqlchatbotData += ` AND a.carpet_area > 1000 AND a.carpet_area <= 5000`;
                sqlParams.push(carpet_area);
            }
            else if (carpet_area === '5000') {
                sqlchatbotData += ` AND a.carpet_area > 5000`;
                sqlParams.push(carpet_area);
            }
        }
        if (bedroom) {
            sqlchatbotData += ` AND a.bedroom = ?`;
            sqlParams.push(bedroom);
        }
        if (furnishing_status) {
            sqlchatbotData += ` AND a.furnishing_status = ?`;
            sqlParams.push(furnishing_status);
        }
        if (processing_status) {
            sqlchatbotData += ` AND a.processing_status = ?`;
            sqlParams.push(processing_status);
        }
        if (posted_since && posted_since !== 'all') {
            console.log('hi')
            const today = new Date();
            const formatDate = (date) => {

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            let dateFilter;
            switch (posted_since) {
                case 'yesterday':
                    today.setDate(today.getDate() - 1);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) = ?`;
                    sqlParams.push(dateFilter);

                    break;
                case 'last-week':
                    today.setDate(today.getDate() - 7);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) >= ?`;
                    sqlParams.push(dateFilter);
                    break;
                case 'last-2-week':
                    today.setDate(today.getDate() - 14);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) >= ?`;
                    sqlParams.push(dateFilter);
                    break;
                case 'last-3-week':
                    today.setDate(today.getDate() - 21);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) >= ?`;
                    sqlParams.push(dateFilter);
                    break;
                case 'last-month':
                    today.setDate(today.getDate() - 30);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) >= ?`;
                    sqlParams.push(dateFilter);
                    break;
                case 'last-2-month':
                    today.setDate(today.getDate() - 60);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) >= ?`;
                    sqlParams.push(dateFilter);
                    break;
                case 'last-3-month':
                    today.setDate(today.getDate() - 90);
                    dateFilter = formatDate(today);
                    sqlchatbotData += ` AND DATE(created_at) >= ?`;
                    sqlParams.push(dateFilter);
                    break;
                default:
                    break;
            }
        }
        if (posted_by) {
            if (posted_by === "O") {
                sqlchatbotData += ` AND m.user_type = ?`;
                sqlParams.push(posted_by);
            } else if (posted_by === "A") {
                sqlchatbotData += ` AND m.user_type = ?`;
                sqlParams.push(posted_by);
            } else if (posted_by === "B") {
                sqlchatbotData += ` AND m.user_type = ?`;
                sqlParams.push(posted_by);
            }
            else if (posted_by === "C") {
                sqlchatbotData += ` AND m.user_type = ?`;
                sqlParams.push(posted_by);
            }
        }


        const validFacings = [
            'east', 'north', 'south', 'west',
            'north-east', 'south-east', 'north-west', 'south-west'
        ];

        if (facing && validFacings.includes(facing)) {
            sqlchatbotData += ` AND a.facing = ?`;
            sqlParams.push(facing);
        }

        const validOwnership = ['free_holding', 'Lease_hold', 'attorney', 'co-operative'];
        if (ownership_details && validOwnership.includes(ownership_details)) {
            sqlchatbotData += ` AND a.ownership_details = ?`;
            console.log(sqlchatbotData)
            sqlParams.push(ownership_details);
        }

        if (floor_no) {
            if (floor_no === '1-4') {
                sqlchatbotData += ` AND a.floor_no > 1 AND a.floor_no <= 4`;
                sqlParams.push(floor_no);
            } else if (floor_no === '5-8') {
                sqlchatbotData += ` AND a.floor_no > 4 AND a.floor_no <= 8`;
                sqlParams.push(floor_no);
            } else if (floor_no === '9-12') {
                sqlchatbotData += ` AND a.floor_no > 9 AND a.floor_no <= 12`;
                sqlParams.push(floor_no);
            } else if (floor_no === '13-16') {
                sqlchatbotData += ` AND a.floor_no > 13 AND a.floor_no <= 16`;
                sqlParams.push(floor_no);
            }
            else if (floor_no === '16') {
                sqlchatbotData += ` AND a.floor_no > 16`;
                sqlParams.push(floor_no);
            }
        }

        if (super_area) {
            if (super_area === '100') {
                sqlchatbotData += ` AND a.super_area <= ?`;
                sqlParams.push(super_area)
            } else if (super_area === '200') {
                sqlchatbotData += ` AND a.super_area >100 AND a.super_area<=200`;
                sqlParams.push(super_area)
            } else if (super_area === '300') {
                sqlchatbotData += ` AND a.super_area >200 AND a.super_area<=300`;
                sqlParams.push(super_area)
            }
            else if (super_area === '400') {
                sqlchatbotData += ` AND a.super_area >300 AND a.super_area<=400`;
                sqlParams.push(super_area)
            }
            else if (super_area === '500') {
                sqlchatbotData += ` AND a.super_area >400 AND a.super_area<=500`;
                sqlParams.push(super_area)
            }
            else if (super_area === '1000') {
                sqlchatbotData += ` AND a.super_area >500 AND a.super_area<=1000`;
                sqlParams.push(super_area)
            }
            else if (super_area === '1500') {
                sqlchatbotData += ` AND a.super_area >1000 AND a.super_area<=1500`;
                sqlParams.push(super_area)
            }
            else if (super_area === '2000') {
                sqlchatbotData += ` AND a.super_area >1500 AND a.super_area<=2000`;
                sqlParams.push(super_area)
            }
            else if (super_area === '3000') {
                sqlchatbotData += ` AND a.super_area >2000 AND a.super_area<=3000`;
                sqlParams.push(super_area)
            }
            else if (super_area === '5000') {
                sqlchatbotData += ` AND a.super_area >3000 AND a.super_area<=5000`;
                sqlParams.push(super_area)
            }
            else if (super_area === '10000') {
                sqlchatbotData += ` AND a.super_area >5000 AND a.super_area<=10000`;
                sqlParams.push(super_area)
            }else if (super_area === '25000') {
                sqlchatbotData += ` AND a.super_area >10000 AND a.super_area<=25000`;
                sqlParams.push(super_area)
            }else if (super_area === '50000') {
                sqlchatbotData += ` AND a.super_area >25000 AND a.super_area<=50000`;
                sqlParams.push(super_area)
            }
            else if (super_area === '50000') {
                sqlchatbotData += ` AND a.super_area >25000 AND a.super_area<=50000`;
                sqlParams.push(super_area)
            }

        }
        const validbathroom = ['1', '2', '3', '4', '5', '6'];
        if (bathroom && validbathroom.includes(bathroom)) {
            sqlchatbotData += ` AND a.bathroom = ?`;
            sqlParams.push(bathroom);
        }
        const validwashroom = ['1', '2', '3', '4', '5', '6'];
        if (washroom_no && validwashroom.includes(washroom_no)) {
            sqlchatbotData += ` AND a.washroom_no = ?`;
            sqlParams.push(washroom_no);
        }
        const validcabinroom = ['1', '2', '3', '4', '5', '6'];
        if (cabin_room && validcabinroom.includes(cabin_room)) {
            sqlchatbotData += ` AND a.cabin_room = ?`;
            sqlParams.push(cabin_room);
        }
        const validcafeteria = ['dry', 'wet'];
        if (cafeteria && validcafeteria.includes(cafeteria)) {
            sqlchatbotData += ` AND a.cafeteria = ?`;
            sqlParams.push(cafeteria);
        }
        const sqlimageData = 'SELECT * FROM pref_image';
        const sqlkeyNameData = 'SELECT * FROM pref_key_name';
        const sqluserData = 'SELECT user_type, logo, member_name, phone_number, member_email, access_user_id FROM pref_member';

        const queryDatabase = (query, params) => {
            return new Promise((resolve, reject) => {
                dbconnect.query(query, params, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        };

        let orderByClause = ''; // Default sorting
        if (sortBY === 'recent') {
            orderByClause = 'ORDER BY created_at DESC';
        } else if (sortBY === 'low-to-high') {
            orderByClause = 'ORDER BY expected_amt ASC';
        } else if (sortBY === 'high-to-low') {
            orderByClause = 'ORDER BY expected_amt DESC';
        }
        else if (sortBY === 'high-low') {
            orderByClause = 'ORDER BY carpet_area DESC';
        }
        else if (sortBY === 'low-high') {
            orderByClause = 'ORDER BY carpet_area ASC';
        }
        sqlchatbotData += ` ${orderByClause}`;

        // Fetch all data without pagination
        const chatBotData = await queryDatabase(sqlchatbotData, sqlParams);
        const imageData = await queryDatabase(sqlimageData, []);
        const keyNameData = await queryDatabase(sqlkeyNameData, []);
        const userData = await queryDatabase(sqluserData, []);

        // Map and combine data as needed
        const combinedData = chatBotData.map(chatbotEntry => {
            const propertyId = chatbotEntry.property_id;
            const user = userData.find(user => user.access_user_id === chatbotEntry.user_id);
            const images = imageData.filter(image => image.property_id === propertyId);
            const keys = keyNameData.filter(key => key.property_id === propertyId);

            return {
                ...chatbotEntry,
                user_type: user ? user.user_type : null,
                logo: user ? user.logo : null,
                member_name: user ? user.member_name : null,
                //phone_number: user ? user.phone_number : null,
                //member_email: user ? user.member_email : null,
                gallery: keys.map(key => ({
                    key_id: key.key_id,
                    key_name: key.key_name,
                    property_id: key.property_id,
                    images: images
                        .filter(image => image.key_id === key.key_id)
                        .map(image => ({
                            image: image.image,
                        }))
                }))
            };
        });

        // Calculate pagination details based on the filtered data
        const totalRecords = combinedData.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = combinedData.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: paginatedData,
            page: parseInt(page),
            limit: parseInt(limit),
            totalRecords: totalRecords,
            path: 'http://localhost/realestate/frontend-node/public/temp/'
        });

    } catch (error) {
        console.error("Error fetching property details: ", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};
const get_all_property_details = async (req, res) => {
    try {
        const { property_id } = req.params;
        console.log('Property ID:', property_id);

        if (!property_id) {
            return res.status(400).json({ success: false, message: 'Property ID is required' });
        }

        const getChatBotData = () => {
            const sqlChatbotData = 'SELECT * FROM pref_chatbot_data WHERE property_id = ?';
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlChatbotData, [property_id], (err, result) => {
                    if (err) {
                        console.error('Error fetching chatbot data:', err);
                        return reject('Unable to get chatbot data');
                    }
                    console.log('Chatbot Data:', result[0]);
                    resolve(result[0]);
                });
            });
        };

        const getImageData = () => {
            const sqlImageData = 'SELECT * FROM pref_image WHERE property_id = ?';
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlImageData, [property_id], (err, result) => {
                    if (err) {
                        console.error('Error fetching image data:', err);
                        return reject('Unable to get image data');
                    }
                    //console.log('Image Data:', result);
                    resolve(result);
                });
            });
        };

        const getKeyNameData = () => {
            const sqlKeyNameData = 'SELECT * FROM pref_key_name WHERE property_id = ?';
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlKeyNameData, [property_id], (err, result) => {
                    if (err) {
                        console.error('Error fetching key name data:', err);
                        return reject('Unable to get key name data');
                    }
                    //console.log('Key Name Data:', result);
                    resolve(result);
                });
            });
        };

        const getPropertyAmenities = () => {
            const sqlAmenities = 'SELECT pref_property_amenity.amenity_name FROM pref_property_amenity JOIN pref_chatbot_data ON pref_chatbot_data.property_id = pref_property_amenity.property_id WHERE pref_chatbot_data.property_id = ?';
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlAmenities, [property_id], (err, result) => {
                    if (err) {
                        console.error('Error fetching amenities:', err);
                        return reject('Unable to get amenities');
                    }
                    if (result.length === 0) {
                        return resolve([]);
                    }
                    resolve(result);
                });
            });
        };

        // Fetch data using the defined functions
        const chatBotData = await getChatBotData();
        if (chatBotData.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                totalRecords: 0,
                url: 'http://localhost/realestate/frontend-node/public/temp/'
            });
        }

        const imageData = await getImageData();
        const keyNameData = await getKeyNameData();
        const amenitiesData = await getPropertyAmenities();
        const images = imageData;
        const keys = keyNameData;
        const gallery = keys.map(key => ({
            key_id: key.key_id,
            key_name: key.key_name,
            images: images
                .filter(image => image.key_id === key.key_id)
                .map(image => ({
                    image: image.image,
                }))
        }));
        const combinedData = chatBotData;
        combinedData['gallery'] = gallery;
        combinedData['amenities'] = amenitiesData;

        res.status(200).json({
            success: true,
            data: combinedData,
            /* totalRecords: combinedData.length, */
            url: 'http://localhost/realestate/frontend-node/public/temp/',


        });

    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error });
    }
};

const get_property_details_based_on_user = async (req, res) => {
    const token = req.headers.authorization;
    if (token) {
        const tokenSplit = token.split(' ')[1];
        const decoded = jwt.decode(tokenSplit);
        req.user = decoded.data; // Attach the decoded user data to req.user
    } else {
        return res.status(400).json({ message: 'Authorization header missing' });
    }

    try {
        const {
            page = 1,
            limit = 2,
        } = req.query;
        const offset = (page - 1) * limit;

        const user_id = req.user.user_id;

        const sqlchatbotData = `
            SELECT * FROM pref_chatbot_data WHERE user_id = ? LIMIT ? OFFSET ?
        `;

        const getChatBotData = async () => {
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlchatbotData, [user_id, parseInt(limit), offset], (err, result) => {
                    if (err) {
                        return reject("Unable to get chatbot data");
                    }
                    resolve(result);
                });
            });
        };

        const getImageData = async (propertyIds) => {
            const sqlimageData = `SELECT * FROM pref_image WHERE property_id IN (?)`;
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlimageData, [propertyIds], (err, result) => {
                    if (err) {
                        return reject("Unable to get image data");
                    }
                    resolve(result);
                });
            });
        };

        const getKeyNameData = async (propertyIds) => {
            const sqlkeyNameData = `SELECT * FROM pref_key_name WHERE property_id IN (?)`;
            return new Promise((resolve, reject) => {
                dbconnect.query(sqlkeyNameData, [propertyIds], (err, result) => {
                    if (err) {
                        return reject("Unable to get key name data");
                    }
                    resolve(result);
                });
            });
        };

        const chatBotData = await getChatBotData();
        if (chatBotData.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                totalRecords: 0,
                url: 'http://localhost/realestate/frontend-node/public/temp/'
            });
        }

        const propertyIds = chatBotData.map(entry => entry.property_id);
        const imageData = await getImageData(propertyIds);
        const keyNameData = await getKeyNameData(propertyIds);

        const combinedData = chatBotData.map(chatbotEntry => {
            const propertyId = chatbotEntry.property_id;
            const images = imageData.filter(image => image.property_id === propertyId);
            const keys = keyNameData.filter(key => key.property_id === propertyId);
            return {
                ...chatbotEntry,
                gallery: keys.map(key => ({
                    key_id: key.key_id,
                    key_name: key.key_name,
                    images: images
                        .filter(image => image.key_id === key.key_id)
                        .map(image => ({
                            image: image.image,
                        }))
                })),
            };
        });

        // Fetch the total number of records for the user
        const totalRecordsSql = `SELECT COUNT(*) AS total FROM pref_chatbot_data WHERE user_id = ?`;
        const totalRecordsResult = await new Promise((resolve, reject)  => {
            dbconnect.query(totalRecordsSql, [user_id], (err, result) => {
                if (err) {
                    return reject("Unable to get total records");
                }
                resolve(result[0].total);
            });
        });

        res.status(200).json({
            success: true,
            data: combinedData,
            totalRecords: totalRecordsResult,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalRecordsResult / limit),
            url: 'http://localhost/realestate/frontend-node/public/temp/'
        });

    } catch (error) {
        console.error("Error fetching property details: ", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};


module.exports = { get_all_property_details, get_property_details_based_on_user, get_all_property }