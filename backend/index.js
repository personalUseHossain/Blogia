const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');



//getting user collection from db.js file
const collection = require('./DataBase/schema');

//MiddleWare

app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: false, limit: '25mb' }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
}))
app.use(cookieParser());





//using dotenv file
dotenv.config();


//connnecting with database
require('./DataBase/db')
//adding route from differnt folder
app.use(require('./routes/route'))


// starting server
app.listen(process.env.PORT, () => console.log(`server is running on http://localhost:${process.env.PORT}`))