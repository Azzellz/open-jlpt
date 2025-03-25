import API from '@/api'
import type { LLM_ChatParams } from '@root/models'
import { ref } from 'vue'

interface LLM_GenerateOptions {
    onReasoning?: (str: string) => void
    onContent?: (str: string) => void
    onFinish?: () => void
    onBeforeContent?: () => void
}

export function useLLM() {
    const isGenerating = ref(false)

    const isReasoning = ref(false)
    const reasoning = ref('')
    const isContenting = ref(false)
    const content = ref('')

    async function generate(
        llmID: string,
        messages: LLM_ChatParams['messages'],
        options?: LLM_GenerateOptions,
    ) {
        // 重置状态
        isGenerating.value = true
        reasoning.value = ''
        content.value = ''

        await API.User.chatWithLLM(llmID, {
            messages,
            onReasoning(str) {
                isReasoning.value = true
                reasoning.value += str
                options?.onReasoning?.(str)
            },
            onContent(str) {
                if (content.value.length === 0) {
                    options?.onBeforeContent?.()
                }

                isReasoning.value = false
                isContenting.value = true
                content.value += str
                options?.onContent?.(str)
            },
        })

        isGenerating.value = false
        options?.onFinish?.()
    }

    return {
        generate,
        content,
        reasoning,
        isGenerating,
        isContenting,
        isReasoning,
    }
}
