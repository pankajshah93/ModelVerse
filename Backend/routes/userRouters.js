// login logout signup profile
import express from "express"
import { login,logout,signup,profile,deleteAccount} from "../controllers/userControllers.js";
import authUserMiddle from "../middlewares/AuthUserMiddleware.js";
import unauthenticatedRateLimiter from "../middlewares/unauthenticatedRateLimiter.js"
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js"
import loadUserMiddlware from "../middlewares/loadUserMiddleware.js";

const userRouters = express.Router();
userRouters.post("/login",unauthenticatedRateLimiter,login);
userRouters.post("/logout",authUserMiddle,authenticatedRateLimiter,logout);
userRouters.post("/signup",unauthenticatedRateLimiter,signup);
userRouters.get("/profile",authUserMiddle,authenticatedRateLimiter,loadUserMiddlware,profile);//first go authusermiddle then profile
userRouters.delete("/delete",authUserMiddle,authenticatedRateLimiter,loadUserMiddlware,deleteAccount);

export default userRouters;