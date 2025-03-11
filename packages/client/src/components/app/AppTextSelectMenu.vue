<template>
    <!-- <ResizableBox class="max-h-40 max-w-100 flex-y gap-2"> -->
    <div class="flex-y gap-2 max-h-40 max-w-100 flex-y gap-2">
        <!-- 交互栏 -->
        <div class="flex-x items-center p-2">
            <!-- TTS -->
            <n-button text>
                <n-icon size="22" :component="CopyIcon" />
            </n-button>
            <n-divider vertical />
            <!-- Audio -->
            <div v-if="audio" class="flex-x gap-2">
                <n-button text @click="toggleTTS">
                    <n-icon v-if="isSpeaking" size="22" :component="StopIcon" />
                    <n-icon v-else size="22" :component="SpeakerIcon" />
                </n-button>
                <span class="text-gray">/</span>
                <n-button text @click="replay">
                    <n-icon size="21" :component="RetryIcon" />
                </n-button>
            </div>
            <n-button v-else text @click="handleGenerateTTS">
                <n-spin v-if="isLoading" :size="22" />
                <n-icon v-else size="22" :component="SpeakerIcon" />
            </n-button>
            <n-divider vertical />
            <!-- Translate -->
            <n-button text :disabled="!llmID" @click="handleTranslate">
                <n-spin v-if="isTranslating" :size="22" />
                <n-icon v-else size="22" :component="TranslateIcon" />
            </n-button>
            <n-divider vertical />
            <!-- Analysis -->
            <n-button text :disabled="!llmID" @click="handleAnalysis">
                <n-spin v-if="isAnalysising" :size="22" />
                <n-icon v-else size="22" :component="AnalysisIcon" />
            </n-button>
            <n-divider vertical />
            <n-select
                size="tiny"
                placeholder="推荐使用非推理模型"
                class="w-75"
                v-model:value="llmID"
                :options="llmOptions"
            />
        </div>
        <!-- LLM交互文本(markdown) -->
        <template v-if="content">
            <n-divider style="margin-top: 0; margin-bottom: 0" />
            <div
                class="pb-2 flex-1 overflow-auto"
                :class="markdownContentContainerClass"
                v-html="markdownContent"
            />
        </template>
        <!-- tts进度条 -->
        <n-progress
            v-if="audio"
            type="line"
            class="mt-auto"
            :height="5"
            :border-radius="0"
            :percentage="progress"
            :color="{ stops: ['white', 'pink'] }"
            :show-indicator="false"
        />
    </div>
    <!-- </ResizableBox> -->
</template>

<script setup lang="ts">
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
import { computed, ref } from 'vue'
import { useLLM } from '@/composables/llm'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import ResizableBox from '../tools/ResizableBox.vue'

const props = defineProps<{
    selectedText: string
}>()

const userStore = useUserStore()
const message = useMessage()

//#region TTS服务

const {
    isLoading,
    isSpeaking,
    toggle: toggleTTS,
    audio,
    generate: generateTTS,
    replay,
    progress,
} = useEdgeTTS()

async function handleGenerateTTS() {
    const result = await generateTTS(props.selectedText)
    if (isSuccessResponse(result)) {
        isSpeaking.value = true
        audio.value?.play()
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
const markdownContent = computed(() => marked.parse(content.value))
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
            content: props.selectedText,
        },
    ])
    isTranslating.value = false
}
async function handleAnalysis() {
    markdownContentContainerClass.value = 'pl-7 pr-3'
    isAnalysising.value = true
    await generate(llmID.value, [
        {
            // prompt
            role: 'system',
            content: `根据用户给出的文本，请以 ${locale.value} 语言，解析该文本的语法内容，只回复语法解析内容`,
        },
        {
            role: 'user',
            content: props.selectedText,
        },
    ])
    isAnalysising.value = false
}

//#endregion
</script>
