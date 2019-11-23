const express = require('express')
const router = express.Router();
const TDB = require('../api/database/TeacherDB')


router.get("/",(req,res)=>{
    res.status(404).json({message:"This route is not available"})
});


router.post("/",(req,res)=>{
  const username = req.body.username
  const password = req.body.password
  console.log(username , password)
  const x = new TDB()
  x.connect()
  .then((conn)=>{
    conn.query(`SELECT
    teacher.Name AS NAME,
    teacher.id AS tid
FROM
    logindetails
JOIN teacher ON logindetails.tid = teacher.id
WHERE
    logindetails.username = ? AND logindetails.password = ?`,[username,password],(err, teacher)=>{
      if(err)
        res.status(404).json({message:"Data does not exist."})
      else{
        if(teacher.length == 0)
          res.status(404).json({message:"user does not exist."})
        else{
            x.connect()
              .then((conn)=>{
                  conn.query(`select * from teacher where id = ?`,[teacher[0].tid], (err , results)=>{
                      conn.destroy()
                      console.log(results)
                      res.render("./dashboard/index.ejs" , {
                          id : results[0].id,
                          name : results[0].Name,
                          totalAsked : results[0].totalAsked,
                          totalTaken : results[0].totalTaken, 
                      })
                  })
              })
              .catch((e)=>{
                  console.log(e);
                  res.status(500).json({
                      message:"Mysql Error",
                      desc:e
                  })
              })
        }
      }
    })
  })
  .catch((e)=>{
    res.status(404).json({message:"Connection could not be established."})
  })
})


module.exports = router;