const dbConnect = require('../../database/db_connection')

const get_all_agent = (req, res) => {
    const { page = 1, limit = 2 } = req.query

    const sqlQuery = 'SELECT member_id , member_name, member_email, phone_number, logo FROM pref_member WHERE user_type="A"';
    try {
        dbConnect.query(sqlQuery, (err, result) => {
            
            if (err) {
                return res.status(500).json({ status: 'Failed', message: 'Failed to get data', error: err });
            }
            if(result.length===0){
                return res.status(400).json({message:"No Record Found"})
            }
            const totalRecord = result.length
            console.log(totalRecord)
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + parseInt(limit);
            const paginatedData = result.slice(startIndex, endIndex);
            console.log(paginatedData)
            res.status(200).json({
                success: 'true',
                data: paginatedData,
                page: parseInt(page),
                limit: parseInt(limit),
                totalRecord: totalRecord,
                totalPage:Math.ceil(totalRecord/limit),
                path: 'http://localhost/realestate/frontend-node/public/temp/'

            })

        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

};

const get_unique_agent=(req,res)=>{
    const {user_id}=req.params
    try {
        const sqlQuery = 'SELECT member_name, member_email, phone_number, logo FROM pref_member WHERE access_user_id=?';
        dbConnect.query(sqlQuery,[user_id],(err,result)=>{
            if (err) {
                return res.status(500).json({ status: 'Failed', message: 'Failed to get data', error: err });
            }
            return res.status(200).json({
                status: "success",
                result: result[0],
                path: 'http://localhost/realestate/frontend-node/public/temp/'
            });
        })
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { get_all_agent,get_unique_agent}