const mysql=require('mysql')

const connectDB=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"realestate"
})


module.exports=connectDB