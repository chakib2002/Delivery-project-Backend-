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

module.exports={MaxChar}