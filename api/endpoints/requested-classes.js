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


router.post("/fetchRequestedClasses",(req,res)=>{
    TDB.connect()
    .then((conn)=>{
        conn.query(`SELECT
        dest.Name AS takingTeacher,
        src.Name AS askingTeacher,
        s.section,
        s.semester,
        timetable.sess_no AS sess_no,
        r.SessID AS sess_id,
        subjects.coursename AS subject,
        message,
        accepted,
        r.day as day
    FROM
        Requested r
    LEFT JOIN teacher dest ON r.destTID = dest.id
    LEFT JOIN teacher src on r.sourceTID = src.id
    LEFT JOIN session s ON
        s.SessID = r.SessID
    LEFT JOIN subjects ON s.SubjectID = subjects.courseID
    LEFT JOIN timetable ON(
            timetable.t_id = r.sourceTID AND timetable.sess_id = r.SessID AND timetable.day = r.day
        )
    WHERE
        r.sourceTID = ?
    ORDER BY semester , section , subject`,[req.body.tid],(err,results)=>{
        
        conn.release();
        if(err | !results | results.length === 0){
            res.json({message:"No data to send"})
           }else{
            Object.keys(results).map((key,index)=>{
                results[key]["time"] = timing[results[key].sess_no]
            })
            res.json({message:"Success",results})
           }
            })
        })
        .catch((e)=>{
            console.log(e)
            res.json({message:"No data to send"})
        })
})

module.exports = router;