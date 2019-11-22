const express = require('express');
const router = express.Router();
const TDB = require('../api/database/TeacherDB')



router.get("/substitute",(req,res)=>{
    res.redirect("./profile/")
})

router.post("/substitute" , (req,res)=>{
    const Tid = req.body.id;
    const x = new TDB();
    if(Tid===""){
        res.status(500).json({
            message:"No Teacher ID Secified",
            desc:e
        })
    }
    x.connect()
    .then((conn)=>{
            conn.query(`SELECT
                            teacher.id AS id,
                            timetable.day as day, 
                            teacher.Name AS NAME,
                            subjects.coursename AS SUBJECT,
                            session.Section as section,
                            session.semester as semester,
                            timetable.sess_no as session_number,
                            session.SessID as sessID,
                            subjects.isLab as isLab
                        FROM
                            timetable
                        JOIN session ON session.SessID = timetable.sess_id
                        JOIN teacher ON timetable.t_id = teacher.id
                        JOIN subjects ON session.SubjectID = subjects.courseID
                        WHERE timetable.t_id = ?
                        ORDER BY  day`,[Tid], (err , results)=>{
                            conn.destroy()
            if(err){
                res.json({"message":"Could not find the data you are looking for!"})
            }
            else{
                //console.log(results)
                //res.json(results)
                res.render("./timetable/index.ejs" , {data:results})
            }
        })
    })
    .catch((e)=>{
        console.log(e);
        res.status(500).json({
            message:"Mysql Error",
            desc:e
        })
    })
});



router.get("/free",(req,res)=>{
    const sessId=2;
    const dept = "Computer Science";
    const x = new TDB();
    x.connect()
    .then((conn)=>{
        // conn.query(`select * from TimeTable where Sess`+sessId+` IS NULL AND TeacherID IN (Select id from teacher join department on dept_no = deptNumber where deptName = ?)`,[dept], (err , results)=>{
        //     res.send(results)
        // })
        conn.query(`SELECT DISTINCT
        teacher.ID,
        teacher.Name
    FROM
        timetable t
    RIGHT JOIN teacher ON t_id = teacher.id
    JOIN department ON teacher.dept_no = department.deptNumber
    WHERE NOT EXISTS
        (
        SELECT
            *
        FROM
            timetable t1
        WHERE
            t1.t_id = t.t_id AND sess_no = ?
    ) AND department.deptName = ?` , [sessId , dept] , (err , results)=>{
        conn.destroy()
            res.json(results)
        })
    })
    .catch((e)=>{
        console.log(e);
        res.status(500).json({
            message:"Mysql Error",
            desc:e
        })
    })
})


router.get("/",(req,res)=>{
    const x = new TDB();
    x.connect()
    .then((conn)=>{
        conn.query("select * from teacher" , (err , results)=>{
            res.send(results)
        })
    })
    .catch((e)=>{
        res.status(500).json({
            message:"Mysql Error",
            desc:e
        })
    })
})


module.exports = router;