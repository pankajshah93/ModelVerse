import { createClient } from "redis";

const redisClient = createClient({
    url:process.env.REDIS_URL
});

redisClient.on("error",()=>{
  console.log("redis error",error);  
});

const connectRedis = async()=>{
    await redisClient.connect();
    console.log("redis connect successfully");
};

export {redisClient , connectRedis};