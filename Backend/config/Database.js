//all database conenction raddis vector write 
import mongoose from "mongoose";

const connectDB = async ()=>{
    //if use here try or catch then you are using this function there then vaha par error show nahi karega kyuki error yahi handle ho 
    //gaya hai dont use try or catch write normal without this 
    // try{
        // await mongoose.connect("mongodb+srv://pankajshah9685_db_user:tKkJsgXBkeNjZvcv@cluster0.q5vgd4m.mongodb.net/");
        // console.log("Database connected successfully");
    // }
    // catch(err){
    //     console.log("Database conection failed");
    //     console.log(err);
    // }
    //if any error occure in bd connection then jaha ye function call hua hoga vaha error handle hoga
    // await mongoose.connect("mongodb+srv://pankajshah9685_db_user:tKkJsgXBkeNjZvcv@cluster0.q5vgd4m.mongodb.net/"); dont write like this use ..env
     await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");

}
export default connectDB;