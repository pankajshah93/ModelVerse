import dotenv from "dotenv/config"
import express from "express"
import connectDB from "./config/Database.js"
import {connectRedis} from "./config/redis.js"
import userRouters from "./routes/userRouters.js";
import chatRoute from "./routes/chatRouters.js";
import messageRouter from "./routes/messageRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";



// dotenv.config();
//jaise hi ye file run hoga process.env me sari value aa jayegi fir usko kahi bhi use kar sakte hai

// app.use accept all type of request only match url

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// app.use("/",(req,res)=>{
//     res.json("hello ji");
// })

app.use(express.json());
app.use(cookieParser());



app.use("/user",userRouters);
app.use("/message",messageRouter);
app.use("/chat",chatRoute)

//http://localhost/chat/createchat
// http:localhost/user/logout   this  mathch user related 
// http:localhost/user/login   this  mathch user related 
// http:localhost/user/signup   
// http:localhost/user/profile   

//http:.ocalhost/message/read
//http:.ocalhost/message/delete
//http:.ocalhost/message/edit

//after that create api 
//login signup signin profile : user related authentication
//chat api;
//message api 


const startserver = async ()=>{
    try{
        await connectDB();//if this function throw error than catch handle
        await connectRedis();
        app.listen(process.env.PORT,()=>{
            console.log(`server start listening at port ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log(err);
    }
}
startserver();
// app.listen(3000,()=>{
//     console.log("listen 3000 at port");
// })