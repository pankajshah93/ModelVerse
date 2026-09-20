import jwt from "jsonwebtoken"
import { redisClient } from "../config/redis.js";
const authUserMiddle = async (req,res,next)=>{
    try{
        const {token} = req.cookies;

        if(!token){
            return res.status(401).json({
                message:"kindly login first"
            })
        }

      
        const payload = jwt.verify(token,process.env.JWT_SECRET); 

          //if token redis ke blocklist me hai to nikal 
          const blockedToken = await redisClient.get(
            `blocklist:${token}`
          );
        if(blockedToken){
            return res.status(401).json({
                message:"login again",
            });
        }  

        // const existUser = await User.findById(payload.id);//see again
        // if(!existUser){
        //     return res.status(400).json({
        //         message:"user does not exist",
        //     })
        // }
        req.userId = payload.id;
        req.token = token;
        req.tokenPayload = payload;
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"internal server error",
        })
    }
}

export default authUserMiddle;