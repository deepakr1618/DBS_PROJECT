const express = require('express')
const app = express()
const TDB = require('./api/database/TeacherDB')
const bodyParser = require('body-parser')
const t_info = require('./routes/teacher_info')
const profile = require("./routes/profile")
const apiEndpoints = require("./api/api-endpoints/searchinEndPoint")


app.use(express.static("views"));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


 
app.use("/teachers",t_info)
app.use("/profile" , profile)
app.use("/substitute" , apiEndpoints)


app.post("/" , (req,res)=>{
    res.send("Hello")
})


app.listen(3000);