import { useEdgeTTS, useLLM, useSTT } from '@/composables'
import { isSuccessResponse } from '@root/shared'
import { NButton, NDivider, NSelect, useMessage } from 'naive-ui'
import { defineComponent, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent(() => {
    const speechText = ref('请开始说话...')
    const replyText = ref('')
    const message = useMessage()
    const audioContext = ref<AudioContext | null>(null)
    const isSafari = ref(false)

    // 检查浏览器类型和音频上下文状态
    onMounted(() => {
        // 检测是否是Safari浏览器
        isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

        // 创建音频上下文
        try {
            audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
        } catch (e) {
            console.error('AudioContext not supported', e)
        }
    })

    //#region LLM

    const llm = useLLM({
        extends: ['selection'],
    })
    async function handleToLLM(text: string = speechText.value) {
        const prompt = `你现在是日常对话的AI，请根据用户的问题给出回答，用户说什么语言就回复什么语言，如果用户有说多种语言，请用其中说的最多的语言回复`
        const result = await llm.generate(
            llm.currentLLMID.value,
            [
                {
                    role: 'system',
                    content: prompt,
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
            {
                custom: llm.currentLLM.value?.local ? llm.currentLLM.value : void 0,
            },
        )
        return result.content
    }

    //#endregion

    //#region TTS

    const tts = useEdgeTTS()
    async function handleToTTS(text: string) {
        const result = await tts.generate(text)
        if (isSuccessResponse(result)) {
            tts.play()
        } else {
            message.error(result.error)
        }
    }

    //#endregion

    //#region STT

    const stt = useSTT()
    async function handleSST() {
        // 重置一下音频上下文
        if (audioContext.value?.state !== 'closed') {
            await audioContext.value?.resume()
        }

        let text = ''
        stt.start()
        stt.onResult(async (_text) => {
            speechText.value = _text
            text += _text + ' '
        })
        stt.onEnd(async () => {
            speechText.value += '。'
            if (!text) {
                return
            }
            const content = await handleToLLM(text)
            replyText.value = content
            await handleToTTS(content)

            tts.onEnd(async () => {
                if (audioContext.value?.state !== 'closed') {
                    await audioContext.value?.suspend()
                }
                handleSST()
            })
        })
    }
    function handleStop() {
        speechText.value += '。'
        stt.stop()
        stt.onEnd(() => {
            stt.isSpeaking.value = false
        })
    }

    onUnmounted(() => {
        stt.stop()
        if (audioContext.value?.state !== 'closed') {
            audioContext.value?.close()
        }
    })
    onDeactivated(() => {
        stt.stop()
        if (audioContext.value?.state !== 'closed') {
            audioContext.value?.close()
        }
    })

    //#endregion

    return () => (
        <main class="h-full flex-y">
            <div class="flex-1 flex">
                <div class="m-auto flex-y gap-2">
                    <div class="text-4xl font-bold">Speech 口语练习</div>
                    <div class="text-2xl">{speechText.value}</div>
                </div>
            </div>
            <div class="h-16 p-2 flex-x gap-2 mx-auto">
                <NButton
                    onClick={handleSST}
                    loading={stt.isSpeaking.value}
                    disabled={stt.isSpeaking.value}
                >
                    说话
                </NButton>
                <NButton onClick={handleStop} disabled={!stt.isSpeaking.value}>
                    停止
                </NButton>
                <NSelect
                    value="ja-JP"
                    class="max-w-50"
                    options={[
                        { label: '日语', value: 'ja-JP' },
                        { label: '中文', value: 'zh-CN' },
                    ]}
                    onUpdateValue={(value) => stt.setLanguage(value)}
                />
                <NSelect
                    value={llm.currentLLMID.value}
                    class="max-w-50"
                    options={llm.llmOptions.value}
                    onUpdateValue={(value) => {
                        llm.currentLLMID.value = value
                    }}
                />
            </div>
        </main>
    )
})
