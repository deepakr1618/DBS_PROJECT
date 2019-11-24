const express = require('express')
const TDB = require('../api/database/TeacherDB')
const router = express.Router()

const timing = {
    1:"09:00 - 09:55",
    2:"09:55 - 10:50",
    3:"10:05 - 12:00",
    4:"12:00 - 12:55",
    5:"01:45 - 02:40",
    6:"02:40 - 03:35",
    7:"03:35 = 04:30"   
}


router.get("/pending",(req,res)=>{
    const tid = req.session.tid;
    console.log(tid)
    const x = new TDB();
    x.connect()
    .then((conn)=>{
        conn.query(`SELECT
        r.ReqID AS rid,
        dest.Name AS takingTeacher,
        dest.id AS takingTID,
        src.Name AS askingTeacher,
        src.id AS askingTID,
        s.section AS section,
        s.semester AS semester,
        timetable.sess_no AS sess_no,
        r.SessID AS sess_id,
        subjects.coursename AS subject,
        message,
        r.day AS day
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
        accepted = 0 AND r.destTID = ?
    ORDER BY semester , section , subject` ,[tid], (err, results)=>{
            if(err){
                res.status(404).json({message:"Something went wrong on execution of query!"})
                console.log(err)
            }
            else if(results.length === 0){
                res.render("./pending/index.ejs",{name:"NONE" , data:[]})
            }  
            else{
                Object.keys(results).map((key, data)=>{
                    results[key]["time"] = timing[results[key].sess_no]
                })
                console.log(results)
                res.render("./pending/index.ejs",{name:results[0].takingTeacher , data:results})
            }
        })
    })
    .catch((err)=>{
        res.status(404).json({message:"Something went wrong!"})
    })
    
})


module.exports = router;