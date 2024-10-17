const moongose=require('mongoose')
const connection=async()=>{
    try{
        // mongoose.set('strictQuery',false)
        await moongose.connect(process.env.MongoDB)
        console.log('DB connected')
    }

    catch(error){
        console.log('DB connection error')
    }
}

module.exports=connection;