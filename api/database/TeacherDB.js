const mysql = require('mysql');

class TeacherDB{
    constructor(){
        try{
            this.connection = mysql.createPool({
                multipleStatements : true,
                connectionLimit : 5,
                host     : 'remotemysql.com',
                user     : 'EHDxCOwisX',
                password : 'ysku5tHhcZ',
                database : 'EHDxCOwisX'
              });
        }
        catch(e){
            console.log(e)
            this.connection = null
        }
    }
    connect(){
        return new Promise((resolve,rej)=>{
            if(this.connection === null){
                rej({message:"Connection failed"})
            }else{
                this.connection.getConnection((err,conn)=>{
                    if(err)
                        throw err
                    resolve(conn)
                })
            }
        })
    }
}



const pool = new TeacherDB();
// pool.connection.on('acquire', function (connection) {
//     console.log('Connection %d acquired', connection.threadId);
// });

// pool.connection.on('release', function (connection) {
//     console.log('Connection %d released', connection.threadId);
//   });


module.exports = pool;


