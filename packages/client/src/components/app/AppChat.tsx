import { computed, defineComponent, ref } from 'vue'
import AppIntroduction from '@/components/app/AppIntroduction'
import { useLLM } from '@/composables/llm'
import { NButton, NDivider, NIcon, NInput, NSelect } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import SakuraIcon from '@/components/icon/SakuraIcon'
import { marked } from 'marked'
import dayjs from 'dayjs'
import { Delete20Regular as DeleteIcon } from '@vicons/fluent'

interface ChatRecord {
    question: {
        value: string
        timeStamp: number
    }
    content: {
        value: string
        timeStamp: number
    }
    reasoning: {
        value: string
        timeStamp: number
    }
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
    const historyRecords = localStorage.getItem('chat-records')
    if (historyRecords) {
        chatRecords.value = JSON.parse(historyRecords)
    }
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
            question: {
                value: question.value,
                timeStamp: Date.now(),
            },
            content: {
                value: '',
                timeStamp: 0,
            },
            reasoning: {
                value: '',
                timeStamp: 0,
            },
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
                    currentRecord.value!.content.value += str
                    scrollToBottom() // 每次内容更新时滚动到底部
                },
                onReasoning(str) {
                    currentRecord.value!.reasoning.value += str
                    scrollToBottom() // 每次推理更新时滚动到底部
                },
                onBeforeContent() {
                    currentRecord.value!.reasoning.timeStamp = Date.now()
                },
                onFinish() {
                    currentRecord.value!.content.timeStamp = Date.now()
                },
            },
        )

        // 保存对话记录
        localStorage.setItem('chat-records', JSON.stringify(chatRecords.value))
    }

    function handleResetRecords() {
        localStorage.removeItem('chat-records')
        chatRecords.value = []
    }

    function handleDeleteRecord(index: number) {
        chatRecords.value.splice(index, 1)
    }

    //#endregion

    return () => (
        <div class="flex-y gap-5">
            <div ref={chatContainerRef} class="flex-y flex-1 overflow-auto gap-10 p-5">
                <AppIntroduction />
                {/* 对话记录 */}
                <div class="flex-y gap-10">
                    {chatRecords.value.map((history, index) => {
                        return (
                            <div class="flex-y gap-2">
                                {/* 用户提问 */}
                                <div class="flex-y gap-3 ml-auto">
                                    <div class="ml-auto rounded-md py-2 px-4 oj-shadow max-w-100">
                                        {history.question.value}
                                    </div>
                                    <div class="mr-1 text-gray text-[12px]">
                                        {dayjs(history.question.timeStamp).format(
                                            'YYYY-MM-DD HH:mm:ss',
                                        )}
                                    </div>
                                </div>
                                {/* 模型回答 */}
                                <div class="flex-y gap-3 max-w-100">
                                    <div class="flex-x gap-2 items-center ">
                                        <NIcon class="mb-1" size="24" component={SakuraIcon} />
                                        <span class="text-gray">{currentLLM.value?.name}</span>
                                        <NButton
                                            text
                                            class="ml-auto"
                                            onClick={() => handleDeleteRecord(index)}
                                        >
                                            <NIcon size="22" component={DeleteIcon} />
                                        </NButton>
                                    </div>
                                    <div class="rounded-md py-3 px-3 oj-shadow">
                                        {/* 推理 */}
                                        <div
                                            class="text-gray"
                                            innerHTML={
                                                marked(history.reasoning.value ?? '') as string
                                            }
                                        />
                                        {/* 推理和内容之间的分割线 */}
                                        {history.content.value && history.reasoning.value && (
                                            <NDivider />
                                        )}
                                        {/* 内容 */}
                                        <div
                                            innerHTML={
                                                marked(
                                                    history.content.value ??
                                                        '欢迎来到 OpenJLPT，一个用于学习 JLPT 的 AI 驱动的平台，支持 JLPT 全部题型以及个性化学习内容。',
                                                ) as string
                                            }
                                        />
                                    </div>
                                    <div class="ml-auto mr-1 text-gray text-[12px]">
                                        {history.content.timeStamp !== 0 &&
                                            dayjs(history.content.timeStamp).format(
                                                'YYYY-MM-DD HH:mm:ss',
                                            )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* 对话栏 */}
            <div class="flex-x gap-2 p-2 rounded-lg oj-shadow">
                <NSelect
                    v-model:value={currentLLMID.value}
                    class="max-w-50"
                    options={llmOptions.value}
                />
                <NInput
                    v-model:value={question.value}
                    type="textarea"
                    clearable
                    autosize={{
                        minRows: 1,
                        maxRows: 5,
                    }}
                    onKeydown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSend()
                            e.preventDefault()
                        }
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
                <NButton
                    type="warning"
                    onClick={handleResetRecords}
                    disabled={chatRecords.value.length === 0}
                >
                    重置记录
                </NButton>
            </div>
        </div>
    )
})
