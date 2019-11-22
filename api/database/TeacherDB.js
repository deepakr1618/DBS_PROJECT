const mysql = require('mysql');

class TeacherDB{
    connect(){
        return new Promise((resolve,rej)=>{
            try{
                this.connection = mysql.createConnection({
                    host     : 'remotemysql.com',
                    user     : 'EHDxCOwisX',
                    password : 'qck3tztqOR',
                    database : 'EHDxCOwisX'
                  });
                this.connection.connect();
                resolve(this.connection);
            }
            catch(e){ 
                console.log(e)
                rej(e);
            }
        })
    }
}
module.exports = TeacherDB;


