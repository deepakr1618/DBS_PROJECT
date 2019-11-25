const express = require('express')
const TDB = require('../database/TeacherDB')
const router = express.Router();
const webpush = require('web-push')
const publicVapid = 'BHkacef0FIZC37NgBtSAUzfh4MmjGKblF6VakMT8pHD3sxMAT9Q8En1yiKqHxl1KAeZx6clDtulMqhnj4p6fO_0';
const privateVapid = process.env.VAPID_PRIVATE;


webpush.setVapidDetails('mailto:test@test.com', publicVapid, privateVapid);





router.post("/subscribe", (req, res) => {
  try {
    const subscription = req.body;
    const payload = JSON.stringify({
      title: 'SubstituteManagement',
      body: "Sample body",
      icon: 'https://i.ibb.co/SyqCNJW/1527234792.png'
    })
    TDB.connect()
      .then((conn) => {
        conn.query(`INSERT INTO web_push VALUES (? ,?) ON DUPLICATE KEY UPDATE url_token = ?`, [req.session.tid, JSON.stringify(subscription), JSON.stringify(subscription)], (err, results) => {
          conn.release()
          if (err) {
            res.status(400).json({
              message: err
            })
          }
        })
      })
      .catch((e) => {
        res.status(400).json({
          message: e
        })
      })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: e
    })
  }
})

module.exports = router