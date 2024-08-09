const dbconnect=require('../database/db_connection');

const getaminityName=async(req,res)=>{
    try {
        const sql="SELECT name FROM pref_amenity_names where lang !='ar'";
    dbconnect.query(sql,(error,result)=>{
        if(error){
            return res.status(500).json({success:false,error:"failed to fetch data"})
        }
        res.status(200).json({success:true,data:result})
    })
        
}
    catch (error) {
        
        return res.status(501).json({ success: false, error: "Failed to fetch data" });
    }
}
    
    


module.exports=getaminityName;