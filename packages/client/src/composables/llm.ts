import API from '@/api'
import type { LLM_ChatParams } from '@root/models'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'

interface LLM_GenerateOptions {
    custom?: LLM_ChatParams['custom']
    onReasoning?: (str: string) => void
    onContent?: (str: string) => void
    onFinish?: () => void
    onBeforeContent?: () => void
}

export function useLLM() {
    const userStore = useUserStore()
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
            custom: options?.custom,
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

    //#region 模型选择拓展

    const currentLLM = computed(() => {
        return userStore.mergedConfig.llm.items.find((llm) => llm.id === currentLLMID.value)
    })
    const currentLLMID = ref(userStore.mergedConfig.llm.default)
    const llmOptions = computed(() => {
        const options = userStore.mergedConfig!.llm.items.map((llm) => {
            return { label: llm.name, value: llm.id }
        })
        if (currentLLMID.value) {
            return options
        } else {
            return [...options, { label: '请选择模型', value: '' }]
        }
    })

    //#endregion

    return {
        generate,
        content,
        reasoning,
        isGenerating,
        isContenting,
        isReasoning,
        // 模型选择拓展
        currentLLMID,
        currentLLM,
        llmOptions,
    }
}
