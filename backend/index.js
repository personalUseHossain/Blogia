const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');



//getting user collection from db.js file
const collection = require('./DataBase/schema');

//MiddleWare

app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: false, limit: '25mb' }))
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
}))
app.use(cookieParser());
// const publicPath = path.join(__dirname, 'public');
// const userImagePath = path.join(publicPath, 'UserImages')
// app.use('/UserImages', express.static(userImagePath))




//using dotenv file
dotenv.config();


//connnecting with database
require('./DataBase/db')
//adding route from differnt folder
app.use(require('./routes/route'))


// starting server
app.listen(process.env.PORT, () => console.log(`server is running on http://localhost:${process.env.PORT}`))