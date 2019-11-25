const express = require('express')
const router = express.Router()
const TDB = require('../api/database/TeacherDB')


router.get("/", (req, res, next) => {
    res.render("./login/index.ejs", {
        message: ""
    })
})

router.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    TDB.connect()
        .then((conn) => {
            conn.query(`SELECT
        logindetails.tid  AS tid , teacher.Name AS Name
    FROM
        logindetails JOIN teacher on logindetails.tid = teacher.id
    WHERE
        username = ? AND password = ?`, [username, password], (err, results) => {
                conn.release();
                if (err) {
                    console.log(err)
                    res.json({
                        message: "Failed connection!"
                    })

                } else {
                    console.log(results)
                    if (results.length != 0) {
                        req.session.tid = results[0].tid
                        req.session.teacher_name = results[0].Name
                        console.log(req.session)
                        res.redirect("/profile")
                    } else {
                        res.render("./login/index.ejs", {
                            message: "Invalid data"
                        })
                    }
                }
            })
        })
        .catch((e) => {
            res.json({
                message: "Failed connection!"
            })
        })
})



module.exports = router