const express = require('express')
const cookieSession = require('cookie-session')
const app = express()
const env = require('dotenv').config()
const bodyParser = require('body-parser')
const webpush = require('web-push')
const publicVapid = 'BHkacef0FIZC37NgBtSAUzfh4MmjGKblF6VakMT8pHD3sxMAT9Q8En1yiKqHxl1KAeZx6clDtulMqhnj4p6fO_0';
const privateVapid= 'gpahlchBCF--ALXuHe-WMKpUob0MlSjCsBqU91v23uk';


webpush.setVapidDetails('mailto:test@test.com' , publicVapid , privateVapid);




const DB = require('./api/database/TeacherDB')
const t_info = require('./routes/teacher_info')
const pending = require("./routes/pending")
const profile = require("./routes/profile")
const show_staffs = require("./routes/show_staffs")
const checkLogin = require("./routes/checkLogin")
const logout = require("./routes/logout")
const checkSession = require("./routes/checkSession")

//ALL API ENDPOINTS
const apiSub = require('./api/endpoints/sub-request')
const apiAccepted = require('./api/endpoints/accepted-classes')
const apiRequested = require('./api/endpoints/requested-classes')
const apiAcceptRequest = require('./api/endpoints/acceptRequest')


app.use(bodyParser.urlencoded({ extended: false}))

app.set('view engine', 'ejs');
app.use(cookieSession({
    secret: process.env.SECRET,
    signed: true,
  }));
app.use(bodyParser.json())
app.use(express.static("views"));




app.use("/login" , checkLogin)
app.use("/api",apiSub)
app.use("/api",apiAccepted)
app.use("/api",apiRequested)
app.use("/api",apiAcceptRequest)
app.use("/api/*",(req,res,next)=>{res.status(404).json({message:"No Such Endpoint"})})



//RESTRICTED ACCESS
app.use("/",checkSession)
app.use("/",checkLogin)

app.use("/teachers",t_info)
app.use("/teachers",pending)
app.use("/logout",logout)
app.use("/profile" , profile)
app.use("/substitute" , show_staffs)


//SUBCRIBE ROUTE

app.post("/subscribe",(req,res)=>{
  const subcription = req.body;
  
  res.status(201).json({});
  
  const payload = JSON.stringify({
    title:'Push Test'
  })

  webpush.sendNotification(subcription , payload)
  .catch((err)=>{
    console.log(err)
  })
})





app.get("/" , (req,res)=>{
    res.render("./views/login/index.ejs")
})
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end();
});

app.listen(process.env.PORT|3000);
