const express = require("express");
const user = require("./modal/user");
const brypt =require("bcrypt");
let jwt = require("jsonwebtoken");
const isAuth = require("./middleware/auth");
const cookieParser= require("cookie-parser");
let app= express();
app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.post("/signup",async (req,res)=>{
 const {name,email,password}=req.body;
 let existUser=await user.findOne({email});
 if(existUser){
    res.send("user already exist");
    return;
 }
let userData=await user.create({name,email,password:await brypt.hash(password,10)});

let token=jwt.sign({
    userId:userData._id,email
}, 'secret', { expiresIn: "1hr" });
userData.token =token;
userData.password=undefined;
res.status(200).cookie("token",token,{expires:new Date(Date.now()+24*24*60*60*1000),httpOnly:true}).json({userData})

});

app.get("/login",async(req,res)=>{
    const {email,password}=req.body;
    let userData=await user.findOne({email});
    let token ;
if(userData&&await brypt.compare(password,userData.password)){
    token=jwt.sign({
        userId:userData._id,email
    }, 'secret', { expiresIn: "1hr" });
    userData.token=token;
    }
    userData.password = undefined;
    res.status(200).cookie("token",token,{expires:new Date(Date.now()+24*24*60*60*1000),httpOnly:true}).json({userData})


//  console.log(existUser);
})

app.get("/dashboard",isAuth,(req,res)=>{
    res.send("welcome to dashboard")
})
module.exports =app;

