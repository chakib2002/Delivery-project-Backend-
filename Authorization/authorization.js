const Query=require('../database_config/DB').query
const is_transporter=(req,res,next)=>{
    if(req.session.passport.user){
    Query("select status from users where id=? ",[req.session.passport.user]).then(
        (response)=>{
            if (!response[0].seller){
                next()
            }else{
                res.status(401).json({
                    error: new Error('Unauthorized')
            })
        
        }})

    }else{
        res.status(401).json({
            error: 'Unauthorized' })
}}
const is_seller=(req,res,next)=>{
    if(req.session.passport.user){
    Query("select status from users where id=? ",[req.session.passport.user]).then(
        (response)=>{
            if (!response[0].seller){
                res.status(401).json({
                    error:Error('Unauthorized')
            })
          
            }else{
                next()
        
        }})

    }else{
        res.status(401).json({
            error: new Error('Unauthorized') })
}}

module.exports={is_seller,is_transporter}