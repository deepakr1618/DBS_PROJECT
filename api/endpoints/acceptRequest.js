const express = require('express')
const TDB = require('../database/TeacherDB')
const router = express.Router();

const timing = {
    1: "09:00 - 09:55",
    2: "09:55 - 10:50",
    3: "10:05 - 12:00",
    4: "12:00 - 12:55",
    5: "01:45 - 02:40",
    6: "02:40 - 03:35",
    7: "03:35 = 04:30"
}

const webpush = require('web-push')
const publicVapid = 'BHkacef0FIZC37NgBtSAUzfh4MmjGKblF6VakMT8pHD3sxMAT9Q8En1yiKqHxl1KAeZx6clDtulMqhnj4p6fO_0';
const privateVapid = process.env.VAPID_PRIVATE;


webpush.setVapidDetails('mailto:test@test.com', publicVapid, privateVapid);


const sendNoti = (sendTo , payload)=>{
  console.log(sendTo)
  webpush.sendNotification(sendTo, payload)
  .catch((err) => {
    console.log(err)
  })
}


router.post("/acceptRequest", (req, res) => {
    const tid = req.session.tid;
    const req_id = req.body.request_id;
    const taking_tid = req.body.taking_tid;
    const asking_tid = req.body.asking_tid;
    const day = req.body.day;
    const sessID = req.body.sess_id;
    const mode = req.body.mode;
    console.log([taking_tid, asking_tid, asking_tid, taking_tid, asking_tid, sessID, day, taking_tid])
    if (tid != taking_tid || asking_tid.length === 0 || day.length === 0 || !sessID) {
        res.json({
            message: "Something went wrong please reload"
        })
    } else {
        TDB.connect()
            .then((conn) => {
                if (mode === "accept") {
                    conn.query(`
                            UPDATE Requested SET accepted = 0 WHERE ReqID = ? AND destTID = ?;
                            DELETE FROM Requested where sourceTID = ? AND SessID = ? AND day = ? AND destTID != ? AND accepted = 1;
                            UPDATE teacher set totalTaken = totalTaken+1 where id = ? ;
                            UPDATE teacher set totalAsked = totalAsked+1 where id = ? ;`,
                        [req_id, taking_tid, asking_tid, sessID, day, taking_tid, taking_tid, asking_tid], (err, results) => {

                            conn.release();
                            if (err) {
                                console.log(err)
                                res.status(500).json({
                                    message: "Query Error!"
                                })
                            } else {
                                const notifyTo = asking_tid
                                TDB.connect()
                                    .then((conn1) => {
                                        const payload = {
                                            title: 'Your request got accepted!',
                                            body: 'Your substitute request was accepted by :' + req.session.teacher_name,
                                            icon: 'https://i.ibb.co/MDkSSv5/image.png'
                                        }
                                        conn1.query(`SELECT url_token FROM web_push where tid = ?`, [notifyTo], (err, results1) => {
                                            conn1.release()
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                console.log(results1[0].url_token)
                                                console.log("DONE")
                                                sendNoti(JSON.parse(results1[0].url_token) , JSON.stringify(payload))
                                            }
                                        });
                                    })
                                res.redirect(req.get('referer'));
                            }
                        })
                } else if (mode === "reject") {
                    conn.query(`delete from  Requested WHERE ReqID = ? AND destTID = ?`, [req_id, tid], (err, results) => {

                        conn.release();
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                message: "Query Error!"
                            })
                        } else {
                            res.redirect(req.get('referer'));
                        }
                    })
                } else {
                    res.json({
                        message: "Unknown command!"
                    })
                }
            })
            .catch((e) => {
                console.log(e)
                res.status(500).json({
                    message: "Couldnt connect to server"
                })
            })
    }
})

module.exports = router;