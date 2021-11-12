const {IntArray} = require('./Validating_fields')

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

module.exports={register, item_post, item_request}