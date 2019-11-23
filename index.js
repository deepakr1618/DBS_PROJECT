const express = require('express')
const cookieSession = require('cookie-session')
const app = express()
const env = require('dotenv').config()
const bodyParser = require('body-parser')


const TDB = require('./api/database/TeacherDB')
const t_info = require('./routes/teacher_info')
const profile = require("./routes/profile")
const show_staffs = require("./routes/show_staffs")
const checkLogin = require("./routes/checkLogin")
const logout = require("./routes/logout")
const checkSession = require("./routes/checkSession")
const api = require('./api/endpoints/sub-request')


app.use(bodyParser.urlencoded({ extended: false}))

app.set('view engine', 'ejs');
app.use(cookieSession({
    secret: process.env.SECRET,
    signed: true,
  }));
app.use(bodyParser.json())
app.use(express.static("views"));



app.use("/login" , checkLogin)
app.use("/api",api)



//RESTRICTED ACCESS
app.use("/",checkSession)

app.use("/teachers",t_info)
app.use("/logout",logout)
app.use("/profile" , profile)
app.use("/substitute" , show_staffs)


app.get("/" , (req,res)=>{
    res.render("./login/index.ejs")
})


app.listen(3000);