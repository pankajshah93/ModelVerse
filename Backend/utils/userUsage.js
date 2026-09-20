

// export const resetUsageIFNeeded = async (user)=> {
//         const now = new Date();

//         if(now > user.usage.resetAt){
//             user.usage.tokenUsed = 0;
//             user.usage.resetAt = new Date(Date.now() + 60 * 60 * 1000);
//             await user.save();
//         }
// }
//use redis for this 

// export const HasTokenLimitReached = (user)=>{
//     return user.usage.tokenUsed >= user.usage.tokenLimit; 
// };

//user / jo token abhi user ne kharch kiye hai usse add kro
export const addUserTokenUsed = async (user,totalTokens)=>{
    // user.usage.tokenUsed += totalTokens;
    //only total token go in data
    user.usage.totalTokenUsed += totalTokens


    await user.save();
}