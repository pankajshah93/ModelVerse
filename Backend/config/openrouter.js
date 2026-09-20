import { OpenRouter } from "@openrouter/sdk";

if(!process.env.OPENROUTER_API_KEY){
    throw new Error("open roter api is missing")
}

const openRouter = new OpenRouter({
    apiKey:process.env.OPENROUTER_API_KEY,
})

export default openRouter