const express = require('express')
const cors = require('cors')
const connectDB = require('./database/db_connection')
const router = require('./router/route')
const bodyParser = require('body-parser');
//const path = require('path');

const app = express()

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

connectDB.connect((err) => {
    if (err) return console.log("error in connect db")
    return console.log("connected")
})

app.use('/api', router)

app.listen(5000, () => {
    console.log("listning.......")
})



