const mysql = require('mysql2/promise')
const config = require('./config');
const pool = mysql.createPool(config.db)


const Transaction = (data,IdOfFirstInsert=false) =>
    new Promise(async (resolve, reject) => {
        const connection = await pool.getConnection()
        try {
            first=true
            var latest_id = 5
            connection.beginTransaction();
            for (const key in data) {
                if (!Array.isArray(data[key]))
                {keys = Object.keys(data[key])
                values = Object.values(data[key]).map((e) => (e === "insert_id" ? id : e))
                querystr = 'insert into ' + key + ' (' + keys.join(", ") + ' ) values (' + keys.map((e) => (e==="destination"||e==="departure"? "ST_PointFromText(?)":'?')).join(', ') + ') ;'
                latest_id = await connection.query(querystr, values).then(e=>(e[0].insertId))
                id=first||!IdOfFirstInsert? latest_id: id
                first=false}
                else{
                    let values=[]
                    let keys=Object.keys(data[key][0])
                    Object.values(data[key]).map(
                        (e)=>{
                            values.push(...Object.values(e).map((e) => (e === "insert_id" ? id : e)))
                    })
                    querystr = 'insert into ' + key + ' (' + keys.join(", ") + ' ) values ' + ' (' + data[key].map((e) =>( keys.map((e)=>('?')).join(' , '))).join(') , (') + ') ;'
                    console.log(querystr)
                    latest_id = await connection.query(querystr, values).then(e => (e[0].insertId))
                    id = first || !IdOfFirstInsert ? latest_id : id
                    first = false
                }
            }
            connection.commit();
            resolve();
            connection.release()
        }
        catch(err) {
            connection.rollback()
            connection.release()
            console.log(querystr)
            console.log(err)
            reject(err)
        }
    })


module.exports = { Transaction }