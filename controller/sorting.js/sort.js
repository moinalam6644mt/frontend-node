const dbConnect=require('../../database/db_connection')

const sortProperty=async(req,res)=>{
    try {
        const {sortBy}=req.query
    let orderByClouse='ORDER BY created_at DESC';
     
    if(sortBy==="low-to-high"){
        orderByClouse='ORDER BY expected_amt ASC'
    }
    else if(sortBy==='low-to-high'){
        orderByClouse='ORDER BY expected_amt DESC'
    }

    const sqlQuery=`SELECT * FROM pref_chatbot_data ${orderByClouse}`
    dbConnect.query(sqlQuery,(err,result)=>{
            if(err){
                return res.status(5000).json({status:'failed',message:"error in fetching data"})
            }
            return res.status(200).json({status:'success',data:result})
    })
        
    } catch (error)
     {
       return  res.status(5000).json({status:'failed',message:"server error",error:error}) 
    }
}

module.exports={sortProperty}