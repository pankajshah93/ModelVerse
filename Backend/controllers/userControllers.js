//login logout signup profile
//this is also called business logic
import User from "../model/userSchema.js";
import bcrypt from "bcrypt"
import { json } from "express";
import jwt from "jsonwebtoken";
import { signschema,loginSchema } from "../validators/UserValidator.js";
import messageRouter from "../routes/messageRouter.js";
import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";
import { redisClient } from "../config/redis.js";

//token ko rakne ke liye db jisse verify hoga jab logout kar denge to 

const createToken = (id,email)=>{
    if(!process.env.JWT_SECRET){
        throw new error("JWT secret key missing");
    }
    const token = jwt.sign({id,email},process.env.JWT_SECRET,{expiresIn:"1h"});
    return token;
}

const cookieOption = {
    httpOnly : true,//js code not read theis code
    secure:false,//http me bhi chjal jayega
    path:"/",
    maxAge:60*60*1000
}

export const signup = async (req,res)=>{
    //client side error solve in try block only server issue solve in catch 
    try{
        //this data validate karna hai jo frontend se aa raha hai but this code of zod not write this here nahi  to 
        //pura kachr ho jayega business logic of login  

        const result = signschema.safeParse(req.body);//if you using only parse then any error occure in checing then direct send internal server error
        //this result send object
        if(!result.success){
            return res.status(400).json({
                message:result.error.issues[0].message
            })
        }

        // const {name,age,email,password} = req.body;
        const {name,age,email,password} = result.data;
        // if(!name || !email || !password){
        //     return res.status(400).json({
        //         message:"email,password,name or some field are misisng",
        //     })
        // }
        //check email exist or not
        const user = await User.findOne({email});
        if(user){
            return res.status(409).json({
                message:"email id already exist",//this is not correct way beause if anyone want to know this email id exist or not easily find
            })
        }
        const hashPassword = await bcrypt.hash(password,12);
        const userCreated = await User.create({
            name,
            age,
            email,
            password:hashPassword
        });

        //id create hone ke baad token create karte hai
        //_id email: payload
        const token  = createToken(userCreated._id,email);

        res.cookie("token",token,cookieOption);
        res.status(201).json({
            message:"user created succesfully",
            token:token,
            user :{
                name,age,email

            }
        })
    }
    catch(err){
        console.log(err);//this is for our purpose to find error this is only backend terminal
        res.status(500).json({
            message:"internal server error",
            // age:age,
            // email:email
        });
    }
}

export const login =  async (req,res)=>{
    try{

        const result = loginSchema.safeParse(req.body);

        if(!result.success){
            return res.status(400).json({
                message:result.error.issues[0].message
            })
        }

        const {email,password} = result.data;
        if(!email || !password){
            res.status(400).json({
                message:"emai or password some filed are misisng"
            })
        }
        //verify the password
        const existuser = await User.findOne({email});
        if(!existuser){
           return  res.status(401).json({
                message : "invalid credential"
            })
        }
        const isMatch = await bcrypt.compare(password,existuser.password);
        if(!isMatch){
            res.status(401).json({
                message:"invalid credential",
            })
        }
        const token = createToken(existuser._id,email);
        res.cookie("token",token,cookieOption);

        res.status(200).json({

            message:"user loged successfully",
            token:token,
            user:{
            name:existuser.name,
            age:existuser.age,
            email:existuser.email,
            usage:existuser.usage
            }
           
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"internal server error",
        })
    }
}

export const logout = async (req,res)=>{
    //redis ke ander dal do as blocklisted token at the time of ttl time for 
    // blocklist = "token" ttl 
    try{
        if(req.token){
            const token = req.token;
            const payload = req.tokenPayload;

            const currenttime = Math.floor(Date.now()/1000);
            const remainingTime = payload.exp - currenttime;
            if(remainingTime > 0){
                await redisClient.set(
                    `blocklist:${token}`,
                    "blocked",
                    {
                        Ex:remainingTime
                    }
                );
            }
        //ttl
        //ttl = payloadtime - currenttime
        }
        

        res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        path:"/"
    })
    res.status(200).json({
        message:"user loged out successfully",
    })
    }catch(err){
        res.status(500).json({
            message:"internal server error"
        })
    }
   
}

//profile ko sirf main dekhu or koi nahi 
//this profile me aane se pehle authenticate karo bases or token
//auithentikate user jo sirf apni hi profile ko acces kar sakta hai isko hum token ke bases pe verfify karenge
//every time acces profile ,delete chat, read chat any thing related to you ,every time your token authentication require
////use middleware to  create this authentication

// export const profile = async (req,res)=>{
//     //if any one can see your profile based on email id then not need to authenticate like intagram any one see profile
//     try{
//         const {email} = req.body;
//         if(!email){
//             return res.status(400).json({
//                 message:"email is missing",
//             })
//         }
//         const existuser = await User.findOne({email});
//         if(!existuser){
//             return res.status(401).json({
//                 message:"invalid credential",
//             })
//         }
//         res.status(200),json({
//             name:existuser.name,
//             age:existuser.age,
//             usage:existuser.usage,
//             email:existuser.email
//         })
//     }catch(err){
//         console.log(err),
//         res.status(500).json({
//             message:"internal server error",
//         })
//     }
// }

export const profile = async (req,res)=>{
    try{
        //profile ki info send karo 
        //database me dubara call karni padegi user ko searcn karna padega
        res.status(200).json({
            name:req.user.name,
            age:req.user.age,
            usage:req.user.usage,
            email:req.user.email
        })
           
    }
    catch(err){
        console.log(err),
        res.status(500).json({
        message:"internal server error",
        })
    }
}

export const deleteAccount = async (req,res)=>{
    try{
        //find out all chatId  belong to user

        //delete all message belong to chatId
        //delete all chatId belong to user
        //delete user profile

        const userId = req.user._id;
        //ab is user se related jitne chat ha use find karo 
        // const chats = await Chat.find({userid}).select("_id");
        //this map use every chat id and cereate new array  accroding to chatid
        // const chatIds = chats.map((chat)=> chat._id);
        await Message.deleteMany({
            // chatId:{$in:chats}
            userId
        });

        await Chat.deleteMany({
            userId
        });
        await User.deleteOne({
            _id:userId
        });

        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            path:"/"
        });
        res.status(200).json({
            message:"Account Deleted Successfully"
        });
    }
    catch(err){
        res.status(500).json({
            message:"internal server error"
        });
    }
}