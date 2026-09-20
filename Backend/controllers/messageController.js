// getmessage , sendmessage
// import { verify } from "jsonwebtoken";
import Chat from "../model/chatSchema.js"
import Message from "../model/messageSchema.js"
import {redisClient} from "../config/redis.js"
import mongoose from "mongoose"
import generateAiResponse from "../service/openRouterAi.js"
import {buildMessageForAi} from "../utils/chatContext.js"
import {addUserTokenUsed} from "../utils/userUsage.js"
import { addChatTokenUsage } from "../utils/tokenUsage.js"
import {updateSummaryIfNeeded} from "../service/summaryService.js"


export const getMessage = async (req,res)=>{
    try{
        const {chatId} = req.params;


        // Check whether chatId exists
        if (!chatId) {
            return res.status(400).json({
                message: "chatId is required"
            });
        }

        // Check whether chatId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                message: "Invalid chat ID"
            });
        }

        //verify this chatid belong to user or not
        const chat = await Chat.findOne({
            _id:chatId,
            userId:req.user._id
        })
        if(!chat){
            return res.status(404).json({
                message:"chat is not found"
            })
        };
        const messages = await Message.find({
            chatId : chatId
        }).sort({createdAt:1});

        res.status(200).json({
            message:"your chat is here",
            messages:messages
        });


    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"internal server error"
        })
    }
}
export const sendMessage = async (req,res)=>{
    try{
        const {chatId} = req.params;
        const {content,model} = req.body;

        if(!content || content.trim() == ""){
            return res.status(400).json({
                message:"you didnot send message"
            })
        };

        // await resetUsageIFNeeded(req.user);
        //using redis

        // if(HasTokenLimitReached(req.user)){
        //     return res.status(409).json({
        //         message:"token limit reched plese try after some time",
        //         usage:req.user.usage
        //     })
        // }

        let chat;
        //check existing chatid  valid or not according to id format 
        if(chatId){
            if(!mongoose.Types.ObjectId.isValid(chatId)){
                return res.status(400).json({
                    message:"invalid chat id"
                })
            }
        
        //chat id nahi hai to chatid create karo then next process

        //verify chatid  belong to perticuler user
             chat = await Chat.findOne({
                _id:chatId,
                userId:req.user._id
            })
            if(!chat){
                return res.status(404).json({
                    message:"chat is not found"
                })
            };
        }   
        //new chat case
        else{
            if(!model){
                return res.status(400).json({
                    message:"model is require for new chat"
                });
            }
             chat = await Chat.create({
                userId:req.user._id,
                model,
                topic:content.trim().slice(0,40)
            });
        }  

        //code start for messaging 
        //jiski summary create nahi hui hai
        const oldMessage = await Message.find({
            chatId:chat._id
        })

        .sort({createdAt:1})
        .skip(chat.summarizedTillMessageNumber);

        const MessageforAi = buildMessageForAi({
            chat,
            oldMessage,
            currentMessage:content.trim()
        })
        const {AiReply,usage} = await generateAiResponse({
            model:chat.model,
            messages:MessageforAi
        })
        const userMessage =  await Message.create({
            userId:req.user._id,
            chatId:chat._id,
            role:"user",
            content:content.trim(),
        })
        //this content send to the AI
        // const dummyReply = "sab kuch acha hai";

        // history store karke rakhna hoga ,DB
        //summary create karna padega
        //first check this
        // resetUsageIFNeeded()
        // HasTokenLimitReached()

       const assistentMessage  =  await Message.create({
            userId:req.user._id,
            chatId:chat._id,
            role:"assistant",
            content:AiReply,
            usage
        });
        
        //update chat metadata
        chat.messageCount += 2;

        //if still toipic default  if update from first messsage
        if (
            !chat.topic ||
            chat.topic === "New Chat" ||
            chat.topic === "Untitled chat"
        ) 
        {
            chat.topic = content.trim().slice(0, 40);
        }
        await addChatTokenUsage(chat,usage);
        await addUserTokenUsed(req.user,usage.totalTokens); 

        // redis ke ander info dalo
        const tokenUsed  = await redisClient.incrBy(
            req.tokenUsageKey,
            usage.totalTokens
        );
        if(tokenUsed == usage.totalTokens){
            await redisClient.expire(
                req.tokenUsageKey,
                Number(process.env.TOKEN_WINDOW_SECOND)
            )
        }

        await chat.save();
        res.status(200).json({
            message:"message send suuccefully",
            chatId:chat._id,
            reply:AiReply,
            usage,
            tokenUsed,
            tokenLimit:Number(process.env.TOKEN_LIMIT),
            userMessage,
            assistentMessage 
        })

        updateSummaryIfNeeded(chat._id);
        //this function call after all user need execute but multiple user comes then this summary creation in this server take a long time 
        //in this use kafka for storage area there send this summary creation part create summany in another place 
        //not hanndle  this server kafka only reply i handle this summary part 
        //our backend servr not wait for creation time of this summary
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"internal server error"
        })
    }
}
