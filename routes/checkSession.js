const express = require('express')
const router = express.Router()
const TDB = require('../api/database/TeacherDB')


function checkSession(req,res,next){
    sess = req.session;
    if(!sess.tid){
        res.render("./login/index.ejs",{message:""})
    }
    else{
        next();
    }
}



module.exports = checkSession;