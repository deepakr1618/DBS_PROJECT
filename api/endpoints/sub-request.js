const express = require('express');
const TDB = require('../database/TeacherDB')
const router = express.Router();
const webpush = require('web-push')

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
                  const notifyTo = dtid
                                TDB.connect()
                                    .then((conn1) => {
                                        const payload = {
                                            title: 'Your recieved a request!',
                                            body:  req.session.teacher_name + " sent you a request for substitute class",
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