import type { DeepSeekChatParams, DeepSeekStreamChatChunk, SuccessResponse } from '@root/models'
import { API_INSTANCE } from '..'

export async function chatByStream(
    messages: DeepSeekChatParams['messages'],
    onChunk: (chunk: SuccessResponse<DeepSeekStreamChatChunk>) => void,
) {
    const response = await API_INSTANCE.post(
        '/ai/deepseek/chat',
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

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

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
