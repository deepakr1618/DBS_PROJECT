const express = require('express')
const router = express.Router();
const TDB = require('../api/database/TeacherDB')





router.get("/",(req,res)=>{
    console.log(req.session.tid)
  const x = new TDB()
  x.connect()
  .then((conn)=>{
      conn.query(`select * from teacher where id = ?`,[req.session.tid], (err , results)=>{
          console.log(results)
          if(results){
            res.render("./dashboard/index.ejs" , {
                id : results[0].id,
                name : results[0].Name,
                totalAsked : results[0].totalAsked,
                totalTaken : results[0].totalTaken, 
            })
          }
          else{
              res.json({message:"Your data is not in the database yet!" , error:err})
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
})


module.exports = router;