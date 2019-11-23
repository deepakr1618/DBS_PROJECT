const express = require('express')
const app = express()
const TDB = require('./api/database/TeacherDB')
const bodyParser = require('body-parser')
const t_info = require('./routes/teacher_info')
const profile = require("./routes/profile")
const apiEndpoints = require("./routes/show_staffs")
const checkLogin = require("./routes/checkLogin")
const env = require('dotenv').config()

app.use(express.static("views"));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


 
app.use("/teachers",t_info)
app.use("/profile" , profile)
app.use("/substitute" , apiEndpoints)
app.use("/login" , checkLogin)


console.log(process.env.DB_PASS)

app.get("/" , (req,res)=>{
    res.render("./login/index.ejs")
})


app.listen(3000);