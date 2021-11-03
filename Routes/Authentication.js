const {get_username, add_user} = require('../API/login_queries');
const {Valid} =require('../validate_requests/Validating_types')
const {MaxChar}= require('../validate_requests/Validating_fields')
const {register}= require('../validate_requests/Format')
const passport = require('../Authentication/passport/passport_config')
const bcrypt = require('bcrypt')
const express = require('express')
const Router = express.Router()



Router.post('/register', async(req, res, next)=>{
    const user = await get_username(req.body.username)
    if(user){
        res.status(403).send({message : "Username already exists"})
    }else{
        bcrypt.hash(req.body.password,10 ,async(err, result)=>{
            if(err){
                res.send(500).send({message : "An error has occured, please register again"})
            }else{
                if(Valid(register,req.body) && MaxChar(45,[req.body.first_name,
                                                            req.body.last_name,
                                                            req.body.phone_number,
                                                            req.body.email,
                                                            req.body.username])){
                    await add_user (req.body.username,
                                    req.body.first_name,
                                    req.body.last_name,
                                    req.body.phone_number,
                                    req.body.email,
                                    result,
                                    req.body.status
                                    )
                .then(()=>{res.status(200).send({message : "user registered successfully"})})
                .catch((err)=>{res.status(500).send({message : "An error has occured, please register again"+ err})})
                }else{
                    res.status(400).send({message : "Invalid Input"})
                }
            }
        })

    }
})

Router.post('/login', 
    passport.authenticate('local',{
                                failureRedirect :'/failure',
                                successRedirect:'/success'
                            }))

Router.get('/gone', (req, res, next)=>{
    res.status(200).send({loggedIn : false})
})

Router.get('/success', (req, res, next)=>{
    res.status(200).send({loggedIn : true})
})

Router.get('/failure', (req, res, next)=>{
    res.status(401).send({loggedIn : false})
})
Router.get('/logout',(req, res, next) => {
    req.logOut()
    res.redirect('/gone')
});

Router.get('/login', (req, res, next)=>{
    if(req.user){
        res.status(200).send({loggedIn : true})
    }else{
        res.status(401).send({loggedIn : false})
    }
})



module.exports = Router

