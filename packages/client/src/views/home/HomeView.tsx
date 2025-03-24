import { computed, defineComponent, ref } from 'vue'
import SakuraRain from '@/components/tools/SakuraRain'
import AppIntroduction from '@/components/app/AppIntroduction'
import { useLLM } from '@/composables/llm'
import { NButton, NDivider, NIcon, NInput, NSelect } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import SakuraIcon from '@/components/icon/SakuraIcon'
import { marked } from 'marked'

interface ChatRecord {
    timeStamp: number
    question: string
    content: string
    reasoning: string
}
export default defineComponent(() => {
    const userStore = useUserStore()

    //#region 模型选择

    const currentLLM = computed(() => {
        return userStore.user!.config.llm.items.find((llm) => llm.id === currentLLMID.value)
    })
    const currentLLMID = ref(userStore.user!.config.llm.default)
    const llmOptions = computed(() => {
        if (userStore.user!.config) {
            const options = userStore.user!.config.llm.items.map((llm) => {
                return { label: llm.name, value: llm.id }
            })
            if (currentLLMID.value) {
                return options
            } else {
                return [...options, { label: '请选择模型', value: '' }]
            }
        } else {
            return []
        }
    })

    //#endregion

    //#region 对话

    const { generate, isGenerating, isContenting, isReasoning } = useLLM()
    const chatRecords = ref<ChatRecord[]>([])
    const question = ref('')
    const currentRecord = ref<ChatRecord | null>(null)
    const chatContainerRef = ref<HTMLElement | null>(null)

    const scrollToBottom = () => {
        if (chatContainerRef.value) {
            setTimeout(() => {
                chatContainerRef.value!.scrollTop = chatContainerRef.value!.scrollHeight
            }, 0)
        }
    }

    async function handleSend() {
        // 如果问题为空，则不发送
        if (question.value.trim() === '') {
            return
        }

        // 添加当前记录
        currentRecord.value = {
            timeStamp: Date.now(),
            question: question.value,
            content: '',
            reasoning: '',
        }
        chatRecords.value.push(currentRecord.value)

        // 发送后先滚动到底部
        scrollToBottom()

        // 生成回答
        await generate(
            currentLLMID.value,
            [
                {
                    role: 'user',
                    content: question.value,
                },
            ],
            {
                onContent(str) {
                    currentRecord.value!.content += str
                    scrollToBottom() // 每次内容更新时滚动到底部
                },
                onReasoning(str) {
                    currentRecord.value!.reasoning += str
                    scrollToBottom() // 每次推理更新时滚动到底部
                },
            },
        )
    }

    //#endregion

    return () => (
        <SakuraRain class="gap-5">
            <div ref={chatContainerRef} class="flex-y flex-1 overflow-auto gap-10 p-5">
                <AppIntroduction />
                {/* 对话记录 */}
                <div class="flex-y gap-10">
                    {chatRecords.value.map((history) => {
                        return (
                            <div class="flex-y gap-2">
                                <div class="ml-auto rounded-md py-2 px-4 oj-shadow max-w-125">
                                    {history.question}
                                </div>
                                <div class="flex-y gap-3">
                                    <div class="flex-x gap-2 items-center ">
                                        <NIcon class="mb-1" size="24" component={SakuraIcon} />
                                        <span class="text-gray">{currentLLM.value?.name}</span>
                                    </div>
                                    <div class="mr-auto rounded-md py-3 px-3 oj-shadow max-w-125">
                                        <div
                                            class="text-gray"
                                            innerHTML={
                                                marked(
                                                    history.reasoning ??
                                                        '欢迎来到 OpenJLPT，一个用于学习 JLPT 的 AI 驱动的平台，支持 JLPT 全部题型以及个性化学习内容。',
                                                ) as string
                                            }
                                        />
                                        {history.content && history.reasoning && <NDivider />}
                                        <div
                                            innerHTML={
                                                marked(
                                                    history.content ??
                                                        '欢迎来到 OpenJLPT，一个用于学习 JLPT 的 AI 驱动的平台，支持 JLPT 全部题型以及个性化学习内容。',
                                                ) as string
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* 对话栏 */}
            <div class=" flex-x justify-center gap-2">
                <NSelect
                    v-model:value={currentLLMID.value}
                    class="w-auto"
                    options={llmOptions.value}
                />
                <NInput
                    v-model:value={question.value}
                    class="max-w-125"
                    type="textarea"
                    clearable
                    autosize={{
                        minRows: 1,
                        maxRows: 5,
                    }}
                />
                <NButton
                    type="primary"
                    onClick={handleSend}
                    loading={isGenerating.value}
                    disabled={question.value.trim() === ''}
                >
                    发送
                </NButton>
            </div>
        </SakuraRain>
    )
})
