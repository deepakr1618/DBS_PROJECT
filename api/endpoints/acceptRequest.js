const express = require('express')
const TDB = require('../database/TeacherDB')
const router = express.Router();

const timing = {
    1:"09:00 - 09:55",
    2:"09:55 - 10:50",
    3:"10:05 - 12:00",
    4:"12:00 - 12:55",
    5:"01:45 - 02:40",
    6:"02:40 - 03:35",
    7:"03:35 = 04:30"   
}


router.post("/acceptRequest",(req,res)=>{
    const tid = req.session.tid;
    const req_id = req.body.request_id;
    const taking_tid = req.body.taking_tid;
    const x = new TDB();
    if(tid!=taking_tid){
        res.json({message:"Something went wrong please reload"})
    }
    else{
        x.connect()
        .then((conn)=>{
            conn.query(`UPDATE Requested SET accepted = 1 WHERE ReqID = ? AND destTID = ?`,[req_id , tid],(err,results)=>{
                if(err){
                    console.log(err)
                    res.status(500).json({message:"Query Error!"})
                }else{
                    res.redirect("/profile")
                }
            })
        })
        .catch((e)=>{
            res.status(500).json({message:"Couldnt connect to server"})
        })
    }
})

module.exports = router;