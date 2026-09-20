import express from "express"
import authUserMiddle from "../middlewares/AuthUserMiddleware.js"
import { getrecentChat,getsingleChat,deleteChat,createChat } from "../controllers/chatController.js";
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js"
import loadUserMiddlware from "../middlewares/loadUserMiddleware.js";
const chatRoute = express.Router();

chatRoute.use(authUserMiddle);
chatRoute.use(authenticatedRateLimiter);
chatRoute.use(loadUserMiddlware);
//getrecentchat getsinglechat create chat delete chat

//if all api check authentication then write  in top first authenticate then run thes if 
//not for all then write first this authentication
chatRoute.post("/createChat",createChat);
chatRoute.get("/getrecentChat",getrecentChat);
chatRoute.get("/:chatId",getsingleChat);
chatRoute.delete("/:chatId",deleteChat);

export default chatRoute;