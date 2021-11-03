const Valid= (format,req_body)=>{

    keys=Object.keys(format)
    for (var i=0;i<keys.length;i++){
        console.log(keys[i])
        if (typeof(req_body[keys[i]])!=="undefined"){
            if(Array.isArray(format[keys[i]])){
                let check=true
                   j=0
                   for (const e of format[keys[i]]){
                    if(j){
                        check=check && e(req_body[keys[i]])
                    }else{
                        check=check && typeof(req_body[keys[i]])===e
                        j+=1
                    }
                if(! check){
                    return(false)
                }

                }
            }else{
                if(typeof(req_body[keys[i]])!==format[keys[i]]){
                    return(false)
                }
            }
        }else{
            return(false)
        }
    }
    return(true)

}
module.exports={Valid};