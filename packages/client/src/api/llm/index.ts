import type { LLM_ChatParams, LLM_StreamChatChunk, SuccessResponse } from '@root/models'
import { API_INSTANCE } from '..'

export async function chatByStream(
    id: string,
    messages: LLM_ChatParams['messages'],
    onChunk: (chunk: SuccessResponse<LLM_StreamChatChunk>) => void,
) {
    const response = await API_INSTANCE.post(
        `/llm/${id}/chat`,
        {
            isStream: true,
            messages,
        },
        {
            responseType: 'stream',
            adapter: 'fetch',
        },
    )
    const reader = response.data.getReader()
    const decoder = new TextDecoder()

    let skip = true
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // 跳过第一次解析，因为第一次解析是不规则的，会报错
        if (skip) {
            skip = false
            continue
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(Boolean)
        for (const line of lines) {
            try {
                const update = JSON.parse(line)
                onChunk(update)
            } catch (error) {
                console.error('Error parsing update:', error)
            }
        }
    }
}
