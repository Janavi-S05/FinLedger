
const express=require('express')
const cors=require('cors')
const app=express()
const db=require("./db/db");
require('dotenv').config()
const port=process.env.PORT

//middleware
app.use(express.json())
app.use(cors())

//routes
app.use("/api/task",require("./routes/userDashBoard"))
db()
app.listen(port,()=>{
    console.log('Listening to port: ',port);
})
