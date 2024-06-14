const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcryptjs=require("bcryptjs")
const jsonwebtoken=require("jsonwebtoken")


const {ksrtcmodel} = require("./models/ksrtc")

const app=express()
app.use(cors())
app.use(express.json())


mongoose.connect("mongodb+srv://Annmariyasabu:annmariya@cluster0.gs6ae.mongodb.net/ksrtcdb?retryWrites=true&w=majority&appName=Cluster0")


const generatehashedpassword = async(password)=>{
    const salt=await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)

}

app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedpassword = await  generatehashedpassword(input.password)
    console.log(hashedpassword)
    input.password = hashedpassword
    let ksrtc=new ksrtcmodel(input)
    ksrtc.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("server start")
})