import { redisClient } from "../config/redis.js";

const tokenUsageMiddleware = async (req,res,next)=>{
    try{
        const key = `token-usage:${req.userId}`;

        const tokenUsed = await redisClient.get(key);
        const tokenLimit = Number(process.env.TOKEN_LIMIT);

        if(Number(tokenUsed || 0) >= tokenLimit){
            const remainingTime = await redisClient.ttl(key);
            return res.status(429).json({
                message:"token limit reached please try after some time",
                tokenUsed:Number(tokenUsed),
                tokenLimit,
                retryafter:remainingTime
            })
        }
        req.tokenUsageKey = key;
        next();
    }
    catch(err){
        console.log("token usage middleware error",err);
        next();
    }
};
export default tokenUsageMiddleware;