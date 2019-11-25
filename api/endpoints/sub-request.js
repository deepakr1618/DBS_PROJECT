const express = require('express');
const TDB = require('../database/TeacherDB')
const router = express.Router();

router.get("*", (req, res) => {
    res.json({
        message: "NOT ALLOWED"
    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

router.post("/sendRequestToDest", (req, res) => {
    const stid = req.body.sourceTID;
    const dtid = req.body.destTID;
    const sess_id = req.body.sessid;
    const sess_no = req.body.sess_no;
    let day = req.body.day;
    const message = req.body.message;
    const reqID = getRandomInt(10000, 999999)
    TDB.connect()
        .then((conn) => {
            conn.query("insert into Requested(ReqID , sourceTID , destTID , SessID , message  , day) value(?,?,?,?,?,?)", [reqID, stid, dtid, sess_id, message, day], (err, results) => {

                conn.release();
                console.log(err)
                if (err)
                    res.json({
                        message: "Failure"
                    })
                else {
                    res.send({
                        message: "Success",
                        ReqID: reqID
                    })
                }
            })
        })
        .catch((e) => {
            res.json({
                message: "Failure"
            })
        })

})

module.exports = router;