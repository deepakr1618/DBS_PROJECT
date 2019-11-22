const express = require('express');
const TDB = require('../database/TeacherDB')
const router = express.Router();

router.post("/selectStaff" , (req,res)=>{
   try{
        const tid = req.body.teacherID;
        const sessid = req.body.sessID;
        const sess_no = req.body.sessNo;
        const day = req.body.day;
        const x = new TDB();
        x.connect()
        .then((conn)=>{
            conn.query(`SELECT DISTINCT

            teacher.id,
            teacher.Name,
            department.deptName
        FROM
            timetable t1
        RIGHT JOIN teacher ON t1.t_id = teacher.id
        JOIN department ON teacher.dept_no = department.deptNumber
        WHERE NOT EXISTS
            (
            SELECT
                *
            FROM
                timetable t2
            WHERE
                t2.t_id = t1.t_id AND t2.day = ? AND t2.sess_no = ?
            ORDER BY department.deptName
        )` , [day , sess_no], (err , results)=>{
                if(err)
                    res.json({data:"Something went wrong while querying database!"})
                else{
                    console.log(results)
                    conn.destroy();
                    res.status(200).render('./selectsub/index.ejs',{sourceTID : tid , sessid , sess_no , day , data:results})
                }
            })
        })
        .catch(()=>{res.json({data:"Something went wrong while connecting to database"})})
   }
    catch(e){
        res.json({data:"Something went wrong"});
    }
})





module.exports = router