import API from '@/api'
import type { ClientLLM_Config, LLM_ChatParams } from '@root/models'
import { useUserStore } from '@/stores/user'
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { createJsonBrook } from 'json-brook'

type LLM_GenerateOptions_Extends = 'json' | 'markdown' | 'selection'
interface LLM_GenerateOptions {
    custom?: LLM_ChatParams['custom']
    onReasoning?: (str: string) => void
    onContent?: (str: string) => void
    onFinish?: () => void
    onBeforeContent?: () => void
}

interface Options {
    extends?: LLM_GenerateOptions_Extends[]
}

// 定义基础返回类型
interface BaseLLMReturn {
    isReasoning: Ref<boolean>
    isGenerating: Ref<boolean>
    isContenting: Ref<boolean>
    reasoning: Ref<string>
    content: Ref<string>
    generate: (
        llmID: string,
        messages: LLM_ChatParams['messages'],
        options?: LLM_GenerateOptions,
    ) => Promise<void>
}

// 定义各个扩展的返回类型
interface SelectionExtension {
    currentLLMID: Ref<string>
    currentLLM: ComputedRef<ClientLLM_Config>
    llmOptions: ComputedRef<Array<{ label: string; value: string }>>
}

interface JsonExtension {
    json: Ref<any | null>
    generate: (
        llmID: string,
        messages: LLM_ChatParams['messages'],
        options?: LLM_GenerateOptions & { onJSON?: (jsonFragment: any) => void },
    ) => Promise<void>
}

// 组合类型，根据扩展选项生成最终类型
type LLMReturn<T extends LLM_GenerateOptions_Extends[]> = BaseLLMReturn &
    ('selection' extends T[number] ? SelectionExtension : Partial<SelectionExtension>) &
    ('json' extends T[number] ? JsonExtension : Partial<JsonExtension>)

export function useLLM<T extends LLM_GenerateOptions_Extends[] = []>(
    _options?: Options & { extends?: T },
): LLMReturn<T> {
    const userStore = useUserStore()
    const extensions: Record<string, any> = {}

    //#region 基础
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

    const base = {
        isReasoning,
        isGenerating,
        isContenting,
        reasoning,
        content,
        generate,
    }

    //#endregion

    //#region 模型选择拓展

    if (_options?.extends?.includes('selection')) {
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

        extensions.selection = {
            currentLLMID,
            currentLLM,
            llmOptions,
        }
    }

    //#endregion

    //#region JSON拓展

    if (_options?.extends?.includes('json')) {
        const json = ref<string | null>(null)
        base.generate = async (
            llmID: string,
            messages: LLM_ChatParams['messages'],
            options?: LLM_GenerateOptions & { onJSON?: (jsonFragment: any) => void },
        ) => {
            const jsonBrook = createJsonBrook()
            return await generate(llmID, messages, {
                ...options,
                onContent(str) {
                    if (str === 'json' || str === '```') {
                        return
                    } else {
                        jsonBrook.write(str)
                        json.value = jsonBrook.getCurrent()
                        options?.onJSON?.(json.value)
                        options?.onContent?.(str)
                    }
                },
                onFinish() {
                    jsonBrook.end()
                    options?.onFinish?.()
                },
            })
        }
        extensions.json = {
            json,
        }
    }

    //#endregion

    return {
        ...base,
        ...extensions.selection,
        ...extensions.json,
    } as LLMReturn<T>
}
