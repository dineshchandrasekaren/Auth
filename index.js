const app =require("./app");
const database=require("./config/database");
require("dotenv").config()
app.listen(process.env.PORT,()=>{
    console.log("server is running"); 
 })
 
database.then(()=>{
    console.log("database is connected");
    })