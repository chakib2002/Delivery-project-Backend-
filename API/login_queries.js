const DB = require('../database_config/DB')


const get_username = async (username)=>{
    try {
        const result = await DB.query(`SELECT username FROM users WHERE username = ? ;`, [username])
        return(Boolean(result.length))
    } catch (error) {
        throw error
    }
}
const get_password = async(username)=>{
    try {
        const result = await DB.query(`SELECT password FROM users WHERE username = ? ;`,[username])
        return(result[0].password)
    } catch (error) {
        throw error
    }
}

const add_user = async(username, first_name, last_name, phone_number, email, password, status)=>{
    try {
        result = await DB.query(`INSERT INTO users (username, first_name, last_name, phone_number, email, password, status) VALUES (?,?,?,?,?,?,?) ; `,
        [username, first_name, last_name, phone_number, email, password, status])
    } catch (error) {
        throw error
    }
}

const userby_id= async(id)=>{
    results= await DB.query('select `username` from `users` where `id`= ? ;',[id]);
    return(results[0].username)
}
const id_ofuser= async(username)=>{
    results= await DB.query('select `id` from `users` where `username`= ? ;',[username]);
    return(results[0].id)
}


module.exports={get_username,get_password, add_user, id_ofuser, userby_id}