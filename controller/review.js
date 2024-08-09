const dbconnect=require('../database/db_connection')


const reviewData=(req,res)=>{
    const {property_id}=req.params

    const {Cleanliness_rate,Connectivity_rate,Hospitals_rate,Market_rate,Neighborhood_rate,Parking_rate,Restaurants_rate,Roads_rate,Safety_rate,Schools_rate,Traffic_rate,Transportation_rate,review_description,review_title,user_relation}=req.body
    try {
        const sqlQuery='INSERT INTO pref_review_table (property_id,cleanliness,connectivity,hospital,market,neighbour,parking,restaurant,roads,saftey,school,traffic,transportation,description,review_title,user_relation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) '
        dbconnect.query(sqlQuery,[property_id,Cleanliness_rate,Connectivity_rate,Hospitals_rate,Market_rate,Neighborhood_rate,Parking_rate,Restaurants_rate,Roads_rate,Safety_rate,Schools_rate,Traffic_rate,Transportation_rate,review_description,review_title,user_relation],(err,result)=>{
            if(err){
                res.status(500).json({status:'failed',message:"unable to send review data in database"})
            }
            res.status(200).json({status:'Success',message:"Data sent successfully"})
        })
    
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
    
}

const get_all_review_Detail=(req,res)=>{
    try {
        const sqlQuery='SELECT * FROM pref_review_table';
        dbconnect.query(sqlQuery,(err,result)=>{
            if(err){
                res.status(500).json({status:'failed',message:"not able to get review data"})
            }
            res.status(200).json({status:'Success',data:result})
        })
    } catch (error){
        res.status(500).json({message:"Internal server error"})
    }
    
        
    
}

module.exports={reviewData,get_all_review_Detail}