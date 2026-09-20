//in perticuler chat me kitna token kharch hua hai 


//jab ai reply kar raha hai to vo batata hai prompttoken , completiontoken , totaltoken
export const  addChatTokenUsage = async (chat,usage)=>{
    chat.usage.promptTokens += usage.promptTokens;
    chat.usage.completionTokens += usage.completionTokens;
    chat.usage.totalTokens +=  usage.totalTokens;

    await chat.save();
};
