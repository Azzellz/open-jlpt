export interface DeepSeekStreamChatChunk {
    type: 'reasoning' | 'content'
    content: string
}

export interface DeepSeekChatMessage {
    role: 'user' | 'system'
    content: string
}

export interface DeepSeekChatParams {
    isStream: boolean
    messages: DeepSeekChatMessage[]
}
