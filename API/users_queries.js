const DB = require('../database_config/DB')

const insert_item_post = (async (id_seller,description,departure,destination,length,width,quantity)=>{
    try{
        result = await DB.query("INSERT INTO item_posted (id_seller,description,departure,destination,length,width,quantity) VALUES (?,?,ST_PointFromText(?),ST_PointFromText(?),?,?,?) ;",[id_seller,description,departure,destination,length,width,quantity])
    }catch(err){
        console.log(err)
    }
})

const insert_item_request =(async(id_seller,departure,destination,description,length,width,quantity,price)=>{
    try{
        result = await DB.query("INSERT INTO item_request (id_seller,departure,destination,description,length,width,quantity,price) VALUES (?,ST_PointFromText(?),ST_PointFromText(?),?,?,?,?,?);",[id_seller,departure,destination,description,length,width,quantity,price])
    }catch(err){
        console.log(err)
    }
})
const insert_transportation_c = (async (id_transporter,departure,destination,delivery_date)=>{
    try{
        result = await DB.query("INSERT INTO transportation_post_c (id_transporter,departure,destination,delivery_date) VALUES(?,ST_PointFromText(?),ST_PointFromText(?),?) ;",[id_transporter,departure,destination,delivery_date]) 
    }catch(err){
        console.log(err)
    }
})
const insert_transportation_nc = (async (id_transporter,departure,destination,number_items,necessary_number_items)=>{
    try{
        result = await DB.query("INSERT INTO transportation_post_nc (id_transporter,departure,destination,number_items,necessary_number_items) VALUES (?,ST_PointFromText(?),ST_PointFromText(?),?,?);",[id_transporter,departure,destination,number_items,necessary_number_items])
    }catch(err){
        console.log(err)
    }
})
const insert_transportation_request = (async(id_transporter,price,departure,destination,delivery_date)=>{
    try{
        result = await DB.query("INSERT INTO transporter_request_c (id_transporter,price,departure,destination,delivery_date) VALUES (?,?,ST_PointFromText(?),ST_PointFromText(?),?);",[id_transporter,price,departure,destination,delivery_date])
    }catch(err){
        console.log(err)
    }
})
const search_items = (async (departure,destination)=>{
    try {
        result = await DB.query(`SELECT description,
                                    length,
                                    width, 
                                    quantity, 
                                    first_name, 
                                    last_name, 
                                    phone_number, 
                                    avrRatings ,
                                    departure,
                                    destination
                                FROM item_posted
                                 INNER JOIN users ON item_posted.id_seller = users.id
                            
                                 WHERE ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),departure) =1
                                    AND 
                                        ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),destination) =1 
                                    AND 
                                        status = 0  
                                ORDER BY 
                                    avrRatings DESC ;    
                                    
                                       ` ,[departure,destination])
        return(result)
    } catch (err) {
        console.log(err)
    }
})
const search_confirmed_deliveries = (async(departure,destination)=>{
    try {
        result = await DB.query(`SELECT  first_name, 
                                         last_name, 
                                         phone_number, 
                                         avrRatings, 
                                         delivery_date,
                                         departure,
                                         destination
                                FROM transportation_post_c 
                                INNER JOIN users ON 
                                        transportation_post_c.id_transporter = users.id
                                WHERE ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),departure) =1
                                AND
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),destination) =1
                                AND
                                    delivery_date > CURDATE()
                                AND 
                                    transportation_status = 0 
                                ORDER BY 
                                    delivery_date ASC,
                                    avrRatings DESC;
                                    
                                    `,[departure, destination])
    return(result)
    } catch (err) {
        console.log(err)
    }
})

const search_unconfirmed_deliveries = (async(departure,destination)=>{
    try {
        result = await DB.query(`SELECT 
                                    first_name, 
                                    last_name, 
                                    phone_number, 
                                    avrRatings, 
                                    number_items,
                                    necessary_number_items,
                                    departure,
                                    destination
                                FROM transportation_post_nc 
                                INNER JOIN users ON transportation_post_nc.id_transporter = users.id
                                WHERE 
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),departure) =1
                                        AND
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),destination) =1
                                        AND 
                                    transportation_status = 0
                                ORDER BY 
                                    avrRatings DESC,
                                    necessary_number_items - number_items ASC;
                                    
                                    `,[departure,destination])
    return(result)
    } catch (err) {
        console.log(err)
    }
})

const search_all_deliveries = (async (departure,destination)=>{
    try {
        result = await DB.query(`SELECT first_name, last_name, phone_number, avrRatings, departure, destination, delivery_date, null as number_items, null as necessary_number_items
                                FROM transportation_post_c 
                                INNER JOIN users ON users.id = transportation_post_c.id_transporter
                                WHERE 
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),departure) =1
                                        AND
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),destination) =1
                                        AND
                                    delivery_date > CURDATE()
                                        AND 
                                    transportation_status = 0
                                UNION ALL 
                                SELECT first_name, last_name, phone_number, avrRatings, departure, destination, null as delivery_date, number_items, necessary_number_items
                                FROM transportation_post_nc
                                INNER JOIN users ON users.id = transportation_post_nc.id_transporter
                                WHERE
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),departure) =1
                                        AND
                                    ST_Contains(ST_Buffer(ST_GeomFromText(?),(25) ),destination) =1
                                        AND 
                                    transportation_status = 0 
                                ORDER BY 
                                    avrRatings DESC,
                                    delivery_date ASC,
                                    necessary_number_items - number_items ASC;    
                                
                                    `,[departure,destination,departure,destination])
    return(result)
    } catch (err) {
        console.log(err)
    }
})
const list_All_deliveries = (async (id)=>{
    try {
        result = await DB.query(`SELECT departure, destination, number_items, necessary_number_items, null as delivery_date
                                    FROM transportation_post_nc
                                        WHERE id_transporter = ?
                                UNION ALL 
                                
                                SELECT departure, destination, null as number_items, null as necessary_number_items, delivery_date
                                    FROM transportation_post_c
                                        WHERE id_transporter = ?
                                        
                                ORDER BY 
                                    delivery_date ASC,
                                    necessary_number_items - number_items ASC ;`,[id,id])
    return(result)
    } catch (err) {
        console.log(err)
    }
})

const list_all_items = (async (id_seller)=>{
    try {
        result = await DB.query(`SELECT description, departure, destination, length, width, quantity, status 
                                    FROM item_posted
                                    WHERE id_seller = ?`,[id_seller])
    return(result)
    } catch (err) {
        console.log(err)
    }
})
const list_requests_for_item = (async (id_item_posted,confirmation)=>{
    try {
        result = await DB.query(`SELECT t1.price, t1.departure, t1.destination, t1.delivery_date, t3.first_name, t3.last_name, t3.phone_number, t2.confirmation
                                    FROM transporter_request_c t1 
                                    
                                JOIN item_posted_has_transporter_request_c t2 
                                    ON t2.id_transporter_request_c = t1.id 
                                JOIN users t3
                                    ON t3.id = t1.id_transporter
                                
                                    WHERE 
                                        t2.id_item_posted = ? 
                                    AND 
                                        t2.confirmation = ? 
                                    ORDER BY 
                                        t2.created_at DESC;`,[id_item_posted,confirmation])

    return(result)
    } catch (err) {
        console.log(err)
    }
})

const list_all_requests_for_item = (async(id_item_posted)=>{
    try {
        result = await DB.query(`SELECT t1.price, t1.departure, t1.destination, t1.delivery_date, t3.first_name, t3.last_name, t3.phone_number, t2.confirmation
        FROM transporter_request_c t1 
        
    JOIN item_posted_has_transporter_request_c t2 
        ON t2.id_transporter_request_c = t1.id 
    JOIN users t3
        ON t3.id = t1.id_transporter
    
        WHERE 
            t2.id_item_posted = ?
        ORDER BY 
            t2.created_at DESC ;`,[id_item_posted])
    return(result)
    } catch (err) {
        console.log(err)
    }
})

const list_requests_seller = (async(id_seller)=>{
    try {
        result = await DB.query(` SELECT t1.departure, t1.destination, t1.description, t1.length, t1.width, t1.quantity, t1.price, t1.confirmation, t3.delivery_date, t4.first_name, t4.last_name, t4.phone_number, null as number_items, null as necessary_number_items, t2.created_at
                                    FROM item_request t1
                                    JOIN transportation_post_c_has_item_request t2 ON t1.id = t2.id_item_request
                                    JOIN transportation_post_c t3 ON t3.id = t2.id_transportation_post_c
                                    INNER JOIN users t4 ON t4.id = t3.id_transporter
                                        WHERE id_seller = ? 
                                UNION ALL 
                                    SELECT t5.departure, t5.destination, t5.description, t5.length, t5.width, t5.quantity, t5.price, t5.confirmation, null as delivery_date, t8.first_name, t8.last_name, t8.phone_number, t7.number_items, t7.necessary_number_items, t6.created_at
                                        FROM item_request t5
                                    JOIN transportation_post_nc_has_item_request t6 ON t5.id = t6.id_item_request
                                    JOIN transportation_post_nc t7 ON t7.id = t6.id_transportation_posted_nc
                                    INNER JOIN users t8 ON t8.id = t7.id_transporter 
                                        WHERE id_seller = ?
                                ORDER BY 
                                    created_at DESC ; `,[id_seller,id_seller])
    return(result)
    } catch (err) {
        console.log(err)
    }
})
const list_requests_for_delivery_c = (async(id_delivery,acceptedOrNot)=>{
    try {
            result = await DB.query(`SELECT t1.departure, t1.destination, t1.delivery_date, t2.created_at, t3.length, t3.width, t3.quantity, t3.price, t4.first_name, t4.last_name,t4.phone_number
                                    FROM transportation_post_c t1
                                JOIN transportation_post_c_has_item_request t2 ON t1.id = t2.id_transportation_post_c
                                JOIN item_request t3 ON t3.id = t2.id_item_request
                                INNER JOIN users t4 ON t4.id = t3.id_seller
                                WHERE 
                                    t1.id = ? 
                                AND 
                                    t3.confirmation = ? 
                                ORDER BY 
                                    t2.created_at ASC ;`,[id_delivery, acceptedOrNot])
    return(result)
    } catch (err) {
        console.log(err)
    }
})

const list_requests_for_delivery_nc = ((async(id_delivery, acceptedOrNot )=>{
    try {
        result = DB.query(`SELECT t1.departure, t1.destination, t1.number_items, t1.necessary_number_items, t2.created_at, t3.length, t3.width, t3.quantity, t3.price, t4.first_name, t4.last_name, t4.phone_number
                                FROM transportation_post_nc t1
                            JOIN transportation_post_nc_has_item_request t2 ON t1.id = t2.id_transportation_posted_nc
                            JOIN item_request t3 ON t3.id = t2.id_item_request
                            INNER JOIN users t4 ON t4.id = t3.id_seller
                            WHERE 
                                t1.id = ? 
                            AND 
                                t3.confirmation = ? 
                            ORDER BY 
                                t2.created_at ASC ;`,[id_delivery,acceptedOrNot])
    return(result)
    } catch (err) {
        console.log(err)
    }
}))

const list_request_transporter = (async(id_transporter)=>{
    try {
        result = DB.query(`SELECT t1.price, t1.departure, t1.destination, t1.delivery_date, t2.confirmation, t3.description, t3.length, t3.width, t3.quantity, t4.first_name, t4.last_name, t4.phone_number
                            FROM transporter_request_c t1
                            JOIN item_posted_has_transporter_request_c t2 ON t1.id = t2.id_transporter_request_c
                            JOIN item_posted t3 ON t3.id =t2.id_item_posted
                            INNER JOIN users t4 ON t4.id = t3.id_seller 
                            WHERE id_transporter = ? 
                            ORDER BY 
                                t2.created_at DESC ;
                                  `,[id_transporter])
    return(result)
    } catch (err) {
        console.log(err)
    }
})






module.exports = {insert_item_post,insert_item_request,insert_transportation_c,insert_transportation_nc,
                  insert_transportation_request,search_items,search_confirmed_deliveries,
                  search_unconfirmed_deliveries,search_all_deliveries,list_All_deliveries,list_all_items,list_requests_for_item,
                  list_all_requests_for_item,list_requests_seller,list_request_transporter,list_requests_for_delivery_c,
                    list_requests_for_delivery_nc}