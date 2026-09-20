import { redisClient } from "../config/redis.js";

const  authenticatedRateLimiter = async(req,res,next)=>{
    try{
        // const userId = req.user._id.toString();
        const userId = req.userId;

        const key = `rate-limit:ip:${userId}`; 

        const requestCount = await redisClient.incr(key);
        if(requestCount === 1){
            await redisClient.expire(key,60);
        }else{
            if(requestCount > 20){
                const remainingTime = await  redisClient.ttl(key);
                return res.status(401).json({
                    message:`kindly retry after this time : ${remainingTime}`
                });
            }
        }
        next();
    }
    catch(err){
        console.log("unauthentuicated rate limiter",err),
        next();
    }
}
export default authenticatedRateLimiter