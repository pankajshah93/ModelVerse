import express from "express"
import authUserMiddle from "../middlewares/AuthUserMiddleware.js";
import { sendMessage,getMessage } from "../controllers/messageController.js";
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js"
import tokenUsageMiddleware from "../middlewares/tokenUsageMiddleware.js";
import loadUserMiddlware from "../middlewares/loadUserMiddleware.js";
const messageRouter = express.Router();

messageRouter.use(authUserMiddle);
messageRouter.use(authenticatedRateLimiter);

// getmessage   send message
//if chatid not present

messageRouter.post("/",tokenUsageMiddleware,loadUserMiddlware,sendMessage);
messageRouter.get("/:chatId",loadUserMiddlware,getMessage);
messageRouter.post("/:chatId",tokenUsageMiddleware,loadUserMiddlware,sendMessage);

export default messageRouter;