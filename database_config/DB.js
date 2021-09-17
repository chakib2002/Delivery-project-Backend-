if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const mysql = require('mysql');
const dotenv = process.env 

const pool = mysql.createPool({
    connectionLimit :10,  // the number of connections will node hold open to our database
    password: dotenv.DB_PASSWORD, 
    user: dotenv.DB_USER, 
    database: dotenv.DB_DATABASE, 
    host: dotenv.DB_HOST,
    port: dotenv.DB_PORT 
})

const query =(sql, values)=>
    new Promise((resolve, reject)=>{
        pool.getConnection((error, connection)=>{
            if(error){
                throw(error)   //handle the error (Not connected)
            }else{   
                connection.query(sql, values, (err, rows, fields)=>{  
                    if(err){
                        reject(err)
                    }else if(rows){
                        resolve(rows)
                    }else{
                        resolve(fields)
                    }

                    connection.release();  // When done with the connection, release it. so it stays available for the next connection in the pool
                                        /*  
                                        if you want to destroy the connection completely from the pool use connection.destroy() 
                                        and the pool will create a new connection the next time one is needed. But this will hurt the performance.
                                        */
                })
            }

        })
    })
module.exports={query}