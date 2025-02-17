import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env['API_KEY'], // 替换为 DeepSeek 的密钥
    baseURL: process.env['BASE_URL'], // DeepSeek 的 API 地址
})

interface StreamChatParams {
    /**
     * 是否包含推理过程
     */
    includeResponing?: boolean
    messages: {
        role: 'user' | 'system'
        content: string
    }[]
}

/**
 * 流式对话
 */
async function streamChat({ messages, includeResponing = true }: StreamChatParams) {
    return await client.chat.completions.create({
        messages,
        model: process.env['MODEL_ID'] || '',
        stream: true,
        stream_options: {
            include_usage: includeResponing, // 是否包含推理过程
        },
    })
}

export const DeepSeek = {
    streamChat,
}

export default DeepSeek
