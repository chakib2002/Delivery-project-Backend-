const MaxChar = (number, column)=>{
    let bool = true, j=0 ;
    while(bool===true && j<column.length){
        if(column[j].length > number){
            bool = false
        }
        j++;
    }
    if(bool){
        return true
    }else{
        return false
    }
}
const IntArray=(input)=>{
    if(! Array.isArray(input)){;return(False)}
    valid=true
    Number.isInteger(...input)
    return(valid)
}


module.exports={MaxChar, IntArray}