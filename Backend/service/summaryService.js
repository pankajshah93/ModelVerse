import Chat from "../model/chatSchema.js"
import Message from "../model/messageSchema.js"
import User from "../model/userSchema.js"
import generateAiResponse from  "../config/openrouter.js"

const SUMMARY_CHUNK_SIZE = 20;

// messageCount >= 20 
// 48- 40 >= 20 then create summary


export const updateSummaryIfNeeded = async (chatId)=>{
    const chat = await Chat.findById(chatId);


    if(!chat) return ;
    const unsummmarizedCount = chat.messageCount - chat.summarizedTillMessageNumber;

    if(unsummmarizedCount  < SUMMARY_CHUNK_SIZE){
        return;
    }

    const messageToSummarize = await Message.find({
        chatId : chat._id
    })
    .sort({createdAt : 1})
    //skip the message till 40
    .skip(chat.summarizedTillMessageNumber)
    .limit(SUMMARY_CHUNK_SIZE)


    if(messageToSummarize.length === 0) return;

    const summaryMessages = [
        {
            role:"system",
            constent:"summarize the conversation keep importent context, user goal ,desicion and resolved doubt do not add extra info"
        },
        {
            role:"user",
            content:`previous chat summary ${chat.summary || "no previous summary yet"}`
        }, 

        ...messageToSummarize.map((msg)=>({
            role:msg.role,
            content:msg.content
        })),

        {
            role:"user",
            content:"summarize the above xonversation "
        }
    ];


    const {AiReply, usage} = await generateAiResponse({
        model:chat.model,
        messages:summaryMessages,
    });

    chat.summary = AiReply;
    chat.summaryUpdatedAt = new Date();
    chat.summarizedTillMessageNumber+= messageToSummarize.length;

    chat.usage.promptTokens += usage.promptTokens;
    chat.usage.completionTokens += usage.completionTokens;
    chat.usage.totalTokens += usage.totalTokens;


    await chat.save();

    const user = await User.findById(chat.userId);

    if(user){
        user.usage.tokenUsed += usage.totalTokens;
        user.usage.totalTokenUsed += usage.totalTokens;
        await user.save();
    }
}
