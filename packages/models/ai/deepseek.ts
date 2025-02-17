export interface DeepSeekStreamChatChunk {
    type: 'reasoning' | 'content'
    content: string
}

export interface DeepSeekChatParams {
    isStream: boolean
    messages: {
        role: 'user' | 'system'
        content: string
    }[]
}
