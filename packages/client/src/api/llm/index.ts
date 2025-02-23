import type { LLM_ChatParams, LLM_StreamChatChunk, SuccessResponse } from '@root/models'
import { API_INSTANCE } from '..'

function splitJSONChunks(rawStr: string) {
    const results = []
    let startIndex = 0
    let braceLevel = 0

    for (let i = 0; i < rawStr.length; i++) {
        if (rawStr[i] === '{') {
            if (braceLevel === 0) startIndex = i // 标记对象开始位置
            braceLevel++
        } else if (rawStr[i] === '}') {
            braceLevel--
            if (braceLevel === 0) {
                // 完整对象结束
                try {
                    const candidate = rawStr.slice(startIndex, i + 1)
                    JSON.parse(candidate) // 验证有效性
                    results.push(candidate)
                } catch (e) {
                    console.warn('无效JSON片段:', rawStr.slice(startIndex, i + 1))
                }
            }
        }
    }
    return results
}

export async function chatByStream(
    id: string,
    messages: LLM_ChatParams['messages'],
    onChunk: (chunk: string) => void,
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

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        onChunk(chunk)
    }
}
