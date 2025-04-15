import { useEdgeTTS, useLLM, useSTT } from '@/composables'
import { isSuccessResponse } from '@root/shared'
import { NButton, NDivider, NSelect, useMessage } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent(() => {
    const speechText = ref('请开始说话...')
    const replyText = ref('')
    const message = useMessage()

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
    async function handleSpeech() {
        let text = ''
        stt.start()
        stt.onResult(async (_text) => {
            speechText.value = _text
            text += _text + '、'
        })
        stt.onEnd(async () => {
            if (
                !speechText.value.endsWith('。') &&
                !speechText.value.endsWith('，') &&
                speechText.value !== '请开始说话...'
            ) {
                speechText.value += '。'
            }

            if (!text) {
                return
            }
            replyText.value = await handleToLLM(text)
            await handleToTTS(replyText.value)
            tts.onEnd(handleSpeech)
        })
    }
    function handleStop() {
        speechText.value = ''
        replyText.value = ''
        stt.abort()
        tts.free()
    }

    //#endregion

    return () => (
        <main class="h-full flex-y">
            <div class="flex-1 flex">
                <div class="m-auto max-w-1/2  flex-y gap-2">
                    <div class="text-4xl font-bold px-10">{speechText.value}</div>
                    <NDivider />
                    <div class="text-2xl font-bold  px-10 text-gray-400">{replyText.value}</div>
                </div>
            </div>
            <div class="h-16 p-2 flex-x gap-2 mx-auto">
                <NButton
                    onClick={handleSpeech}
                    loading={stt.isSpeeching.value}
                    disabled={stt.isSpeeching.value}
                    ghost
                    type="success"
                >
                    说话
                </NButton>
                <NButton onClick={handleStop} ghost type="error">
                    停止
                </NButton>
                {/* 语言选择 */}
                <NSelect
                    value="ja-JP"
                    options={[
                        { label: '日语', value: 'ja-JP' },
                        { label: '中文', value: 'zh-CN' },
                    ]}
                    onUpdateValue={(value) => stt.setLanguage(value)}
                />
                {/* LLM选择 */}
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
