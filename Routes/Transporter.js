const router = require('express').Router()
const {insert_transportation_c,insert_transportation_nc,insert_transportation_request,
        search_items,list_All_deliveries, list_request_transporter,list_requests_for_delivery_c,
    list_requests_for_delivery_nc}=require('../API/users_queries')
const {Transaction} =require('../database_config/Transaction')
const Valid = require('../validate_requests/Validating_types').Valid
const {transportation_post_confirmed, transportation_post_not_confirmed,
    transporter_request }=require('../validate_requests/Format')


router.use(require('../Authorization/authorization').is_transporter)

router.get('/',(req,res)=>{
    res.send("hi")
})





router.post('/delivery_post',async (req,res)=>{
    const object= req.body
    const delivery_date = object.hasOwnProperty('delivery_date')
    req.body.id_transporter = req.session.passport.user
    if(delivery_date == true ){
        if(Valid(transportation_post_confirmed, object)){
            await insert_transportation_c(req.body.id_transporter,
                                          req.body.departure,
                                          req.body.destination,
                                          req.body.delivery_date
                                          ) 
            .then(()=>{res.status(200).json({info :"success"})})
            .catch((err)=>{res.status(400).json({error: err})})
            }else{
            res.status(400).json( {error: "Invalid Input"})}
    }else{
        if(Valid(transportation_post_not_confirmed, object)){
            await insert_transportation_nc( req.body.id_transporter,
                                            req.body.departure,
                                            req.body.destination,
                                            req.body.number_items,
                                            req.body.necessary_number_items
                                            )
            .then(()=>{res.status(200).json({info :"success"})})
            .catch((err)=>res.status(400).json({error: err}))
    }else{
        res.status(400).json({error :'Invalid input'})}
    }
})

router.post('/delivery_request',async(req,res)=>{
    req.body.id_transporter = req.session.passport.user
    
        if(Valid(transporter_request, req.body)){
            let {id_item_posted,...data}=req.body
            Transaction({
                transporter_request_c:data,
                item_posted_has_transporter_request_c:id_item_posted.map(e=>({
                    id_item_posted: e,
                    id_transporter_request_c: 'insert_id' }))
            })
            .then(()=>{res.status(200).json({message:"item added succesfully"})})
            .catch((err)=>{res.status(400).json({error:"invalid request"})})
        }else{
            res.status(400).json({error :"Invalid Input"})
            }
    })
router.get('/search_items',async (req,res)=>{
     search_items(req.body.departure,
                  req.body.destination)
            .then((result)=>res.status(200).json({info : result}))
            .catch((err)=>res.status(400).json({error :err}))
})
 
router.get('/list_All_deliveries/:id_transporter', async(req,res)=>{
    const id = parseInt(req.params.id_transporter)
    list_All_deliveries(id)
    .then((result)=>{res.status(200).json({info : result})})
    .catch((err)=>{res.status(400).json({error : err})})

})

router.get('/list_request_transporter', async(req,res)=>{
    const id = parseInt(req.session.passport.user)
    list_request_transporter(id)
    .then((result)=>{res.status(200).json({info : result})})
    .catch((err)=>{res.status(400).json({error : err})})
})
router.get('/list_request_for_deliveries_c/:id_of_delivery/:acceptedOrNot',async(req,res)=>{
    const acceptedOrNot = parseInt(req.params.acceptedOrNot)
    const id_delivery = parseInt(req.params.id_of_delivery)
    list_requests_for_delivery_c(id_delivery,acceptedOrNot)
    .then((result)=>{res.status(200).json({info : result})})
    .catch((err)=>{res.status(400).json({error : err})})
})
router.get('/list_request_deliveries_nc/:id_of_delivery/:acceptedOrNot',async(req, res)=>{
    const id_delivery = parseInt(req.params.id_of_delivery)
    const acceptedOrNot = parseInt(req.params.acceptedOrNot)
    list_requests_for_delivery_nc(id_delivery,acceptedOrNot)
    .then((result)=>{res.status(200).json({info : result})})
    .catch((err)=>{res.status(400).json({error : err})})
})


module.exports=router