require('dotenv').config() // require the .env variables 

const session = require('express-session')
const MySqlStore = require('express-mysql-session')(session)


const options ={
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
}

//set up a session table that contains sessionId, expires and the data in the database automatically.
let sessionStore = new MySqlStore(options)

module.exports={sessionStore}