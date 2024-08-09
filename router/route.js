const express = require('express')
const router = express.Router();

const { register, get_register_data, get_unique_register_data,logo_upload,get_logo } = require('../controller/register')
const { generateOtp, verifyOtp } = require('../controller/generateOtp')
const { login, forget_password, updatePassword, deleteAccount,uniqueUser } = require('../controller/login')
const { catogery_name, property_type } = require('../controller/catogery')
const getCityName = require('../controller/city')
const {getaminityName} = require('../controller/amenities/aminity')
const {insertAmenityValue}=require('../controller/amenities/insertAmenityValue')
const upload_file = require('../controller/chatbot/upload')
const {chatbot_details} = require('../controller/chatbot/chatBot')
const {get_all_property_details,get_property_details_based_on_user,get_all_property}= require('../controller/chatbot/property_details')
const {update_chatbot_details}=require('../controller/chatbot/update_chatbot')
const {seller_enquiry_details,get_all_enquiry_based_on_property,get_all_enquiry,get_all_enquiry_based_on_userId}=require('../controller/enquiry_form/seller_enquiry_form')
const deleteChatDetails =require('../controller/chatbot/delete_chat')
const {getAllImage,getAllpropertyImage}=require('../controller/chatbot/getImage');

const {reviewData,get_all_review_Detail} =require('../controller/review')
const {get_property_details_based_on_userType_agent}=require('../controller/agent/agent_property_details')
const {get_all_agent,get_unique_agent}=require('../controller/agent/allAgent')
const {get_user_data}=require('../controller/user_info/user_data')
const {sortProperty}=require('../controller/sorting.js/sort')
const {project_details}=require('../controller/project/project_details')
const {getUniqueProject,getAllProject}=require('../controller/project/getAllProject')
const deleteProjectDetails =require('../controller/project/deleteProjectDetails')
const {update_project_details}=require('../controller/project/update_project')
const {uploadPropertyImage}= require('../controller/project/uploadPropertyImage')
const {Project_AmenityData}=require('../controller/project/Add_amenityData')
const {Payment}=require('../controller/Payment/Payment')
const {project_view_image}=require('../controller/project/project_view_image')
const {uploadProjectImage}=require('../controller/project/uploadProjectImage')



// Register route
router.post('/register', register);
router.get('/register', get_register_data);
router.get('/register/:id', get_unique_register_data);
router.post('/logo_upload/:member_id',logo_upload)
router.get('/get_logo/:member_id',get_logo)

// OTP route
router.post('/send-otp', generateOtp);
router.post('/verify-otp', verifyOtp);

// Login route
router.post('/login', login);
router.get('/login/:user_id',uniqueUser)
router.get('/forget_password', forget_password);
router.post('/update_password/:userid', updatePassword);
router.post('/delete_account/:id', deleteAccount);

// Category route
router.get('/catogery_name', catogery_name);
router.get('/catogery_name/:id', property_type);


//City route
router.get('/city_name', getCityName)

//aminity route
router.get('/aminity_name', getaminityName)
router.post('/add_amenities',insertAmenityValue)
//router.get('/get_amenities/:property_id',getAmenity_PropertyWise)


//All chatbot route
router.post("/chatbot", chatbot_details)
router.post('/upload', upload_file);
router.get('/property_list',get_all_property);
router.get('/property_details/:property_id',get_all_property_details);
router.post('/update_chatbot/:property_id',update_chatbot_details)
router.post('/property_list_user',get_property_details_based_on_user);
router.delete('/delete_chat_histoy/:propperty_id',deleteChatDetails)
router.get('/get_all_image/:property_id',getAllImage)
router.get('/get_all_image',getAllpropertyImage)
router.get('/agent_property_details',get_property_details_based_on_userType_agent)

//Enquiry Route
router.post('/seller_enquiry/:property_id',seller_enquiry_details)
router.get('/get_all_enquiry/:property_id',get_all_enquiry_based_on_property)
router.get('/get_all_enquiry',get_all_enquiry)
router.get('/get_enquiry_based_on_user/:user_id',get_all_enquiry_based_on_userId)

//review route
router.post('/review/:property_id',reviewData)
router.get('/get_all_review',get_all_review_Detail)

//find agent route
router.get('/get_all_agent',get_all_agent)
router.get('/get_all_agent/:user_id',get_unique_agent)
router.get('/agent_property_details/:user_id',get_property_details_based_on_userType_agent)

//get user Data
router.get('/get_all_user_data',get_user_data)

//sorting data
router.get('/sort',sortProperty)

//project data
router.post('/add_project',project_details)
router.get('/get_unique_project/:id',getUniqueProject)
router.get('/get_all_project',getAllProject)
router.delete('/delete_project/:project_id',deleteProjectDetails)
router.post('/update_project/:project_id',update_project_details)
router.post('/upload_project_file',uploadPropertyImage)
router.post('/add_project_amenity',Project_AmenityData)
router.get('/project_view_image/:project_id',project_view_image)
router.post('/project_image',uploadProjectImage)

//payment Gateway
router.post('/order',Payment)
 
module.exports = router;

 