require('dotenv').config()
const express = require('express')
const Passport = require ('passport')
const session = require('express-session');
const store = require('./database_config/DB_session').sessionStore
const app = express()
const authRoutes = require('./Routes/Authentication')
const sellersRoutes = require('./Routes/Sellers')
const transportersRoutes = require('./Routes/Transporter')

const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
    key : "id",
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
         maxAge: null,
         // httpOnly :true,
         // secure :true,
         // sameSite :'strict'
     }
 
 }));
 
 
 app.use(Passport.initialize())
 app.use(Passport.session())

 app.use((req,res,next) =>{
    console.log(req.session)
    console.log(req.user)
    next()
 })
 

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use(authRoutes)
app.use('/seller', sellersRoutes)
app.use('/transporter', transportersRoutes)




app.listen(port, () => console.log(`Server starting at port :${port}`))