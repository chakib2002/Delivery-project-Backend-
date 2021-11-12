const router = require('express').Router()

const { search_confirmed_deliveries,search_unconfirmed_deliveries,
    search_all_deliveries,list_all_items,insert_item_request,insert_item_post,
    list_requests_for_item,list_all_requests_for_item,list_requests_seller} = require('../API/users_queries')
const Valid =require('../validate_requests/Validating_types').Valid
let item_post=require('../validate_requests/Format').item_post
let item_request=require('../validate_requests/Format').item_request
let Transaction=require('../database_config/Transaction').Transaction


router.use(require('../Authorization/authorization').is_seller)

router.get('/',(req,res)=>{
    res.send("hi")
})

router.post('/item_post',async (req,res)=>{
    req.body.id_seller=req.session.passport.user
    if(Valid(item_post,req.body)){
        insert_item_post(req.body.id_seller,
                         req.body.description,
                         req.body.departure,
                         req.body.destination,
                         req.body.length,
                         req.body.width,
                         req.body.quantity)
        .then(()=>{res.status(200).json({message:"item added succesfully"})})
        .catch((err)=>{res.status(400).json({error:"invalid request"+err})})
    }else{
        res.status(400).json({error:"invalid request"})
    }

})

router.post('/item_request',(req,res)=>{
    if (Valid(item_request,req.body)){
        let {id_transportation_posted_nc,id_transportation_posted_c,...data}=req.body
        data.id_seller=req.session.passport.user
        input={
            item_request: data
        }
        if (id_transportation_posted_nc.length){
            input.transportation_post_nc_has_item_request=
            id_transportation_posted_nc.map(e=>({
                id_item_request: 'insert_id',
                id_transportation_posted_nc: e }))
            }
        if(id_transportation_posted_c.length){
            input.transportation_post_c_has_item_request=
            id_transportation_posted_c.map(e=>({
                id_item_request: 'insert_id',
                id_transportation_post_c: e
            }))
        }        
        Transaction(input,true)
        .then(()=>{res.status(200).json({message:"item added succesfully"})})
        .catch((err)=>{res.status(400).json({error:"invalid request"+err})})
        
    }else{
        res.status(400).json({error:"invalid input"})
    }
})

router.get('/search_confirmed_deliveries',async(req,res)=>{
    search_confirmed_deliveries(req.body.departure,
                                req.body.destination)
            .then((result)=>{res.status(200).json({info : result})})
            .catch((err)=>res.status(400).json({error : err}))
})
router.get('/search_unconfirmed_deliveries',async(req,res)=>{
    search_unconfirmed_deliveries(req.body.departure,
                                  req.body.destination)
            .then((result)=>res.status(200).json({info : result}))
            .catch((err)=>res.status(400).json({error : err}))
})
router.get('/search_all_deliveries',async(req,res)=>{
    search_all_deliveries(req.body.departure,
                          req.body.destination)
            .then((result)=>res.status(200).json({info : result}))
            .catch((err)=>res.status(400).json({error : err}))
})

router.get('/list_all_items/:id_seller',async(req,res)=>{
    const id = parseInt(req.params.id_seller)
    list_all_items(id)
    .then((result)=>res.status(200).json({info : result}))
    .catch((err)=>res.status(400).json({error : err}))

})

router.get('/list_of_requests/:id_item_posted/:confirmation',async(req,res)=>{
    const id_item_posted = parseInt(req.params.id_item_posted)
    const confirmation = parseInt(req.params.confirmation)
    list_requests_for_item(id_item_posted,confirmation)
    .then((result)=>res.status(200).json({info : result}))
    .catch((err)=>res.status(400).json({error : err}))

})

router.get('/list_all_requests/:id_item_posted',async(req,res)=>{
    const id_item_posted = parseInt(req.params.id_item_posted)
    list_all_requests_for_item(id_item_posted)
    .then((result)=>res.status(200).json({info : result}))
    .catch((err)=>res.status(400).json({error : err}))
})

router.get('/list_request_seller',async(req, res)=>{
    const id_seller = req.session.passport.user
    list_requests_seller(id_seller)
    .then((result)=>res.status(200).json({info : result}))
    .catch((err)=>res.status(400).json({error : err}))

})



module.exports=router