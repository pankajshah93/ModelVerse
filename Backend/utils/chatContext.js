//this utils use for define function like use any where not a main business logic just help in code
//cookies creation use multiple time
//context create for message 


//in every differnt chatbot assign a perticuler task not for general purpose or solve any task so define in 
//role :system this is fist preoirity of system give answer according to  this sysytem prompt 


const SYSTEM_PROMPT = `
you are helpfull ai assistent.
give the users answer clearly and accuratly 
if user ask for code then provide clean and practical code.
if user ask explation then explain in structure and simple way
if you are not sure then simply say you are unsure insted of guessing
don't  use abusive language, if user ask related to harm the other then don't answer it
`;

export const buildMessageForAi = ({chat,oldMessage, currentMessage})=> {
    const  messages = [
        {
            role:"system",
            content:SYSTEM_PROMPT
        }
    ]
    if(chat.summary && chat.summary.trim() !== ""){
        messages.push({
            role:"system",
            content:`previous conversation summary:\n${chat.summary}`,
        });
    }

    for(const msg of oldMessage){
        messages.push({
            role:msg.role,
            content:msg.content
        });
    }

    messages.push({
        role:"user",
        content:currentMessage
    })
    return messages;
};
// send in message : system prompt , summary , vo message jiski summary abhi tak nahi bani hai, current message

// total 49 messages then 
//1 - 40 message summary 
// oldermesaage = 41- 48mesage
// currenntmesag = 49

