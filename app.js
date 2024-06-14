const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")


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




app.post("/signIn",(req,res)=>{
    // res.json({"status":"success"}) 2 res couse error

    let input=req.body
    ksrtcmodel.find({"email":req.body.email}).then(
        (response)=>{
            if(response.length>0){
                let dbpassword=response[0].password
            
            console.log(dbpassword)
             bcryptjs.compare(input.password,dbpassword,(error,ismatch)=>{
               if(ismatch){

                jwt.sign({"email":input.emailid},"ksrtc-app",{expiresIn:"1d" },
                    (error,token)=>{
                        if(error){
                            res.json({"status":"unable to create token"})
                        }else{
                             res.json({"status":"success","userid":response[0]._id,"token":token})
                            }
                        }
                    
                )
               }else{
                res.json({"status":"incorrect password"})
               }
             })
            }else{
                res.json({"status":"user not found"})
            }
        }
    ) .catch() 
    
})


app.post("/view",(req,res)=>{
    let token=req.headers["token"]
    jwt.verify(token,"ksrtc-app",(error,decoded)=>{
        if(error){
            res.json({"status":"unauthorised access"})
        }else{
            if(decoded)
                {
                    ksrtcmodel.find().then(
                        (response)=>{
                            res.json(response)
                        }
                    ).catch()
                }
        }
    })
})
app.listen(8080,()=>{
    console.log("server start")
})