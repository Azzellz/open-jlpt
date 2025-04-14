import { useEdgeTTS, useLLM, useSTT } from '@/composables'
import { isSuccessResponse } from '@root/shared'
import { NButton, NSelect, useMessage } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent(() => {
    const speechText = ref('请开始说话...')
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
            tts.toggle()
        } else {
            message.error(result.error)
        }
    }

    //#endregion

    //#region STT

    const stt = useSTT()
    function handleSpeech() {
        speechText.value = ''
        stt.start()
        stt.onResult(async (text) => {
            // 重置上一次的说话结果
            tts.free()
            speechText.value = text

            // console.log(text)
            // if (!speechText.value) {
            //     speechText.value = text
            // } else {
            //     speechText.value += '、' + text
            // }
        })
        stt.onEnd(async () => {
            console.log('end')
            const content = await handleToLLM()
            await handleToTTS(content)

            stt.start()
            stt.isSpeaking.value = true
        })
    }

    function handleStop() {
        speechText.value += '。'
        stt.stop()
        stt.onEnd(() => {
            stt.isSpeaking.value = false
        })
    }

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
                <NButton onClick={handleSpeech} loading={stt.isSpeaking.value}>
                    开始讲话
                </NButton>
                <NButton onClick={handleStop} disabled={!stt.isSpeaking.value}>
                    停止
                </NButton>
                <NButton
                    onClick={() => {
                        tts.toggle()
                    }}
                >
                    说话
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
