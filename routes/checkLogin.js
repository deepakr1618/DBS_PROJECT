const express = require('express')
const router = express.Router()
const TDB = require('../api/database/TeacherDB')


router.get("/",(req,res,next)=>{
    res.render("./login/index.ejs" , {message:""})
})

router.post("/" , (req , res , next)=>{
    const username = req.body.username;
    const password = req.body.password;
    const x = new TDB();
    x.connect()
    .then((conn)=>{
        conn.query(`SELECT
        tid
    FROM
        logindetails
    WHERE
        username = ? AND PASSWORD = ?`,[username,password],(err,results)=>{
            console.log(results)
            if(results){
                req.session.tid = results[0].tid
                res.redirect("/profile")
            }else{
                res.render("./login/index.ejs" , {message:"Invalid data"})
            }
        })
    })
    .catch((e)=>{
        res.json({message:"Failed connection!"})
    })
})



module.exports = router