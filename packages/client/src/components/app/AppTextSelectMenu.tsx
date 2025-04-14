import { defineComponent } from 'vue'
import { useEdgeTTS } from '@/composables'
import { useUserStore } from '@/stores/user'
import { isSuccessResponse } from '@root/shared'
import { NButton, NSelect, NIcon, NDivider, NSpin, useMessage, NProgress } from 'naive-ui'
import {
    Speaker220Regular as SpeakerIcon,
    Copy20Regular as CopyIcon,
    RecordStop20Regular as StopIcon,
    ArrowCounterclockwise20Regular as RetryIcon,
    BookQuestionMark20Regular as AnalysisIcon,
} from '@vicons/fluent'
import { GTranslateOutlined as TranslateIcon } from '@vicons/material'
import { Close as CloseIcon } from '@vicons/carbon'
import { computed, ref } from 'vue'
import { useLLM } from '@/composables/llm'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import TextSelectMenu from '../tools/TextSelectMenu'

export default defineComponent({
    setup(_, { slots }) {
        const userStore = useUserStore()
        const message = useMessage()
        const selectedText = ref('')
        const showMenu = ref(false)

        //#region TTS服务

        const tts = useEdgeTTS()

        async function handleGenerateTTS() {
            const result = await tts.generate(selectedText.value)
            if (isSuccessResponse(result)) {
                tts.isSpeaking.value = true
                tts.play()
            } else {
                message.error('生成失败')
                console.error(result)
            }
        }

        //#endregion

        //#region LLM服务

        const llmID = ref(userStore.user?.config.llm.default || '')
        const llmOptions = computed(() => {
            return userStore.user!.config.llm.items.map((llm) => {
                return {
                    label: llm.name,
                    value: llm.id,
                }
            })
        })

        const { generate, content } = useLLM()
        const { locale } = useI18n()
        const markdownContent = computed(() => marked.parse(content.value) as string)
        const markdownContentContainerClass = ref('')
        const isTranslating = ref(false)
        const isAnalysising = ref(false)
        async function handleTranslate() {
            markdownContentContainerClass.value = 'px-3'
            isTranslating.value = true
            await generate(llmID.value, [
                {
                    // prompt
                    role: 'system',
                    content: `根据用户给出的文本，翻译成 ${locale.value} 语言，只回复译文`,
                },
                {
                    role: 'user',
                    content: selectedText.value,
                },
            ])
            isTranslating.value = false
        }
        async function handleAnalysis() {
            markdownContentContainerClass.value = ' pl-7 pr-3 '
            isAnalysising.value = true
            await generate(llmID.value, [
                {
                    // prompt
                    role: 'system',
                    content: `根据用户给出的文本，请以 ${locale.value} 语言，解析该文本的语法内容，只回复语法解析内容`,
                },
                {
                    role: 'user',
                    content: selectedText.value,
                },
            ])
            isAnalysising.value = false
        }

        function handleClose() {
            showMenu.value = false
            selectedText.value = ''
            tts.free()
        }

        function handleShow() {
            showMenu.value = true
        }

        const Menu = () => (
            <div class="flex-y gap-2 max-h-100 max-w-100 flex-y gap-2">
                {/*  交互栏  */}
                <div class="flex-x items-center p-2">
                    {/*  TTS  */}
                    <NButton text>
                        <NIcon size={22} component={CopyIcon} />
                    </NButton>
                    <NDivider vertical />
                    {/*  Audio  */}
                    {tts.hasAudio.value ? (
                        <div class="flex-x gap-2">
                            <NButton text onClick={tts.toggle}>
                                <NIcon
                                    size={22}
                                    component={tts.isSpeaking.value ? StopIcon : SpeakerIcon}
                                />
                            </NButton>
                            <span class="text-gray">/</span>
                            <NButton text onClick={tts.replay}>
                                <NIcon size="21" component={RetryIcon} />
                            </NButton>
                        </div>
                    ) : (
                        <NButton text onClick={handleGenerateTTS}>
                            {tts.isLoading.value ? (
                                <NSpin size={22} />
                            ) : (
                                <NIcon size={22} component={SpeakerIcon} />
                            )}
                        </NButton>
                    )}

                    <NDivider vertical />
                    {/* Translate */}
                    <NButton text disabled={!llmID.value} onClick={handleTranslate}>
                        {isTranslating.value ? (
                            <NSpin size={22} />
                        ) : (
                            <NIcon size={22} component={TranslateIcon} />
                        )}
                    </NButton>
                    <NDivider vertical />
                    {/* Analysis */}
                    <NButton text disabled={!llmID.value} onClick={handleAnalysis}>
                        {isAnalysising.value ? (
                            <NSpin size={22} />
                        ) : (
                            <NIcon size={22} component={AnalysisIcon} />
                        )}
                    </NButton>
                    <NDivider vertical />
                    <NSelect
                        size="tiny"
                        placeholder="推荐使用非推理模型"
                        class="max-w-50 min-w-30"
                        v-model:value={llmID.value}
                        options={llmOptions.value}
                    />
                    <NButton class="ml-1" text onClick={handleClose}>
                        <NIcon size={24} component={CloseIcon} />
                    </NButton>
                </div>
                {/* LLM交互文本(markdown) */}
                {content.value && (
                    <>
                        <NDivider style="margin-top: 0; margin-bottom: 0" />
                        <div
                            class={
                                markdownContentContainerClass.value + ' pb-2 flex-1 overflow-auto'
                            }
                            innerHTML={markdownContent.value}
                        />
                    </>
                )}
                {/* tts进度条 */}
                {tts.audio.value && (
                    <NProgress
                        type="line"
                        class="mt-auto"
                        height={5}
                        border-radius={0}
                        percentage={tts.progress.value}
                        color={{ stops: ['white', 'pink'] }}
                        show-indicator={false}
                    />
                )}
            </div>
        )

        //#endregion
        return () => (
            <TextSelectMenu
                showMenu={showMenu.value}
                onShow={handleShow}
                onClose={handleClose}
                menu={(text) => {
                    selectedText.value = text
                    return <Menu />
                }}
            >
                {slots.default?.()}
            </TextSelectMenu>
        )
    },
})
