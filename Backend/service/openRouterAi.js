import openRouter from "../config/openrouter.js";

//in messages give like this element form 
//messages[
    // {
    // role:"user"
    // content:'mesaage",
// }
//  {
    // role:"assistent"
    // content:'mesaage",
// }

// ]
//this messages array ko build karna padega
const generateAiResponse = async({model,messages})=>{
//messages : chatId -->summary + message summary part nahi + current message 
//its use for all pupose 
//model chatid

   const completion = await openRouter.chat.send({
        chatRequest:{
            model,
            messages
        },
    });


const AiReply = completion.choices[0]?.message?.content;

if(!AiReply){
    throw new Error("Ai response is empty");   
}

//input token == prompttoken
//output token = completiontoken
const promptTokens = completion.usage?.promptTokens || 0;
const completionTokens = completion.usage?.completionTokens || 0;

    return{
        AiReply,
        usage:{
            promptTokens,
            completionTokens,
            totalTokens : promptTokens + completionTokens
        }
    }
}
export default  generateAiResponse