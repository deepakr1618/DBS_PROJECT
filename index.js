const express = require('express')
const app = express()
const TDB = require('./api/database/TeacherDB')
const bodyParser = require('body-parser')
const t_info = require('./api/routes/teacher_info')



app.use(express.static("views"));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


 
app.use("/teachers",t_info)

app.post("/" , (req,res)=>{
    res.send("Hello")
})


app.listen(3000);