const {IntArray, Date} = require('./Validating_fields')

var register = {
    "username":"string",
    "first_name": "string",
    "last_name":"string",
    "email":"string",
    "phone_number":"string",
    "password":"string",
    "status":"number"
}
var item_post = {
    "id_seller":"number",
    "description": "string",
    "departure": "string",
    "destination": "string",
    "length": "number",
    "width": "number",
    "quantity":"number"
}
var item_request = {
    "departure" : "string",
    "destination" : "string",
    "description" : "string",
    "length" : "number",
    "width" :"number",
    "quantity" : "number",
    "price":"number",
    "id_transportation_posted_nc":["object",IntArray],
    "id_transportation_posted_c":["object",IntArray]
}
var transporter_request = {
    "id_transporter" : "number",
    "price" :"number",
    "departure" :"string",
    "destination" :"string",
    "delivery_date" : ["string",Date],
    "id_item_posted":["object",IntArray]
}
var transportation_post_confirmed = {
    "departure" : "string",
    "destination" : "string",
    "delivery_date" : ["string",Date]
} 

var transportation_post_not_confirmed ={
    "departure" :"string",
    "destination" :"string",
    "number_items" :"number",
    "necessary_number_items":"number",
}

module.exports={register, item_post, item_request, transporter_request,
                transportation_post_confirmed, transportation_post_not_confirmed}