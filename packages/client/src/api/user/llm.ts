import type { LLM_ChatParams } from "@root/models"
import { API_INSTANCE } from ".."


export async function chatWithLLM(
    llmID: string,
    params: {
        messages: LLM_ChatParams['messages']
        onContent?: (content: string) => void
        onReasoning?: (reasoning: string) => void
        onChunk?: (chunk: string) => void
    },
) {
    const _mark = 'e7d974c7436c9a369b93fe49e405364b9bd3060a'
    const { messages, onChunk, onContent, onReasoning } = params
    const response = await API_INSTANCE.post(
        `/users/{{user.id}}/llms/${llmID}/chat`,
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

    let isContentStage = false
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        onChunk?.(chunk)

        // 判断是推理阶段还是内容阶段，通过比较 chunk 是否等于特殊哈希字符串
        if (chunk.startsWith(_mark)) {
            const tail = chunk.split(_mark)[1]
            tail && onContent?.(tail)

            isContentStage = true
            continue
        }

        isContentStage ? onContent?.(chunk) : onReasoning?.(chunk)
    }
}
