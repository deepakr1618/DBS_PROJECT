const express = require('express')
const router = express.Router();
const TDB = require('../api/database/TeacherDB')


router.get("/",(req,res)=>{
    res.status(404).json({message:"No ID Sepcified!"})
});


router.get("/:id",(req,res)=>{
    const name = req.params.id;
    if(!name){
        res.status(404).json({message:"No data found!"})
    }
    else{
    const x = new TDB();
    x.connect()
    .then((conn)=>{
        conn.query(`select * from teacher where Name = ?`,[name], (err , results)=>{
            conn.destroy()
            console.log(results)
            res.render("./dashboard/index.ejs" , {
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
})


module.exports = router;