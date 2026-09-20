import { redisClient } from "../config/redis.js";

const  unauthenticatedRateLimiter = async(req,res,next)=>{
    try{
        //ip address track : key : ip adress ,value = 0,ttl = 60
        const key = `rate-limit:ip:${req.ip}`;
        //if key present then give value

        // const limit = await redisClient.get(key);
        // if(limit == null){
        //     await redisClient.set(key,0,{
        //         Ex:60
        //     }) 
        // }else{
        //     if(limit == 10){
        //         //try afetr sim
        //     }
        // }
        //using incr handle the both cases if not key:value then increse 1 assign

        const requestCount = await redisClient.incr(key);
        if(requestCount === 1){
            await redisClient.expire(key,60);
        }else{
            if(requestCount > 10){
                const remainingTime = await  redisClient.ttl(key);
                return res.status(401).json({
                    message:`kindly retry after this time : ${remainingTime}`
                });
            }
        }
        next();
    }
    catch(err){
        console.log("unauthentuicated rate limiter",err);
        //if redis faill but not stop program 
        //if redis me check nahi kar paya to use error show nahi karvaege next time check kar lenge ratelimit
        next();
    }
}
export default unauthenticatedRateLimiter