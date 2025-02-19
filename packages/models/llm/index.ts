export interface LLM_StreamChatChunk {
    type: 'reasoning' | 'content'
    content: string
}

export interface LLM_ChatMessage {
    role: 'user' | 'system'
    content: string
}

export interface LLM_ChatParams {
    isStream: boolean
    messages: LLM_ChatMessage[]
}
