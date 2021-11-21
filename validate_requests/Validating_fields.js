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

const Date=(str)=>{
    valid=true
    array=str.split("-").map((e)=>(parseInt(e)))
    console.log(array)
    if( array.length===3){
        console.log(array[0]<2200 && array[0]>2000 && array[1]>0 && array[1]<13 && array[2]<31 && array[2]>0)
    return(array[0]<2200 && array[0]>2000 && array[1]>0 && array[1]<13 && array[2]<31 && array[2]>0)
    }else {
        return(false)
    }

}
module.exports={MaxChar, IntArray, Date}