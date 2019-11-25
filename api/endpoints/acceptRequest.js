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
    const asking_tid = req.body.asking_tid;
    const day = req.body.day;
    const sessID = req.body.sess_id;
    const mode = req.body.mode;
    console.log({tid , asking_tid , day , sessID})
    if(tid!=taking_tid || asking_tid.length === 0 || day.length === 0 || !sessID){
        res.json({message:"Something went wrong please reload"})
    }
    else{
        TDB.connect()
        .then((conn)=>{
            if(mode === "accept"){
                conn.query(`UPDATE Requested SET accepted = 1 WHERE ReqID = ? AND destTID = ?;DELETE FROM Requested where sourceTID = ? AND SessID = ? AND day = ? AND destTID != ?`,[req_id , taking_tid , asking_tid , sessID , day , taking_tid],(err,results)=>{
                    
            conn.release();
            if(err){
                        console.log(err)
                        res.status(500).json({message:"Query Error!"})
                    }else{
                        res.redirect(req.get('referer'));
                    }
                })
            }
            else if (mode === "reject") {
                conn.query(`delete from  Requested WHERE ReqID = ? AND destTID = ?`,[req_id , tid],(err,results)=>{
                    
            conn.release();
            if(err){
                        console.log(err)
                        res.status(500).json({message:"Query Error!"})
                    }else{
                        res.redirect(req.get('referer'));
                    }
                })
            }
            else{
                res.json({message:"Unknown command!"})
            }
        })
        .catch((e)=>{
            res.status(500).json({message:"Couldnt connect to server"})
        })
    }
})

module.exports = router;