import User from "../model/userSchema.js"

const loadUserMiddlware = async (req,res,next)=>{
    try{
        const existUser = await User.findById(req.userId);

        if(!existUser){
            return res.status(400).json({
                message:"user dont exist"
            });
        }
        req.user = existUser;
        next();

    }catch(err){
        console.log("load user error",err);
        return res.status(500).json({
            message:"internal server error"
        });
    }
}
export default loadUserMiddlware;