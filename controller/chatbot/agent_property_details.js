const dbconnect = require('../../database/db_connection');

const get_property_details_based_on_userType_agent=(req,res)=>{
    try {
        const sqlQuery='SELECT * FROM `pref_chatbot_data` WHERE user_type="A"';
        dbconnect.query(sqlQuery,(err,result)=>{
            if(err){
                res.status(500).json({status:'Failed',message:"Data not found"})
            }
            res.status(200).json({status:'Success',Data:result})
        })
        
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error})
    }
}

module.exports= {get_property_details_based_on_userType_agent}