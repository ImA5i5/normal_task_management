const mongoose=require("mongoose");

const db=async()=>{
    try{
        const dbConn=await mongoose.connect(process.env.MONGODB_URL)
        if(dbConn){
            console.log("data base connect successfully",dbConn.connection.host)
        }
    }catch(error){
        console.log(error.message)
    }
}
module.exports=db