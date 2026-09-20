import Chat from "../model/chatSchema.js"
import Message from "../model/messageSchema.js" 
import mongoose from "mongoose";

//req.user //isme user ki information store hogi
export const getrecentChat = async (req,res)=>{
    try{
        //in autjhentication already mention this 
        const chats = await Chat.find({userId:req.user._id}).select("topic  createdAt updatedAt").sort({updatedAt:-1}).limit(20);
        res.status(200).json({
            message:"your all recent chats",
            chats
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error",
        })
    }
}

export const getsingleChat = async (req,res)=>{
    try{
        const {chatId} = req.params;
        const chat = await Chat.findOne({
            _id:chatId,
            userId:req.user._id
        });
        if(!chat){
            return res.status(404).json({
                message:"bad request"
            })
        };
        res.status(200).json({
            chat
            // id:chat._id,
            // userId:chat.userId,
            // topic:chat.topic,
            // usage:chat.usage
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error",
        })
    }
}

export  const deleteChat = async (req,res)=>{
    try{
        const {chatId} = req.params;

        //dont directly delete chat first find the perticuler user then delete 
           if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({
                message: "Invalid chat ID"
            });
        }
        const chat = await Chat.findOne({
            _id: chatId,
            userId: req.user._id
        });

        if(!chat){
            return res.status(403).json({
                message:"you are not allow this"
            })
        };
        //if deletye operation perform then both are deleted atomicity maintene
         await Message.deleteMany({
            chatId:chat._id
        })
        await Chat.deleteOne({
            _id:chat._id
        })
        res.status(200).json({
            message:"your chat deleted sucesfully",
            chatId: chat._id
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error",
        })
    }
}

//use arr to fix the model to support
export const createChat = async (req,res)=>{
    try{
            const {model} = req.body;
            //jo user model name bheja hai vo valid hai ki nahi
            if(!model){
                return res.status(400).json({
                    message:"model name is missing",
                })
            }

            const chat = await Chat.create({
                userId:req.user._id,
                model
            })
        //     if (
        //     !chat.topic ||
        //     chat.topic === "New Chat" ||
        //     chat.topic === "Untitled chat"
        // ) 
        // {
        //     chat.topic = content.trim().slice(0, 40);
        // }
            res.status(201).json({
                chat :{
                _id:chat._id,
                userId:req.user._id,
                model,
                topic:chat.topic,
                createdAt:chat.createdAt
                }
               
            })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error",
        })
    }
}