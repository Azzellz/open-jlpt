<template>
    <div class="h-30 flex-y gap-2">
        <div class="flex-x items-center pl-2">
            <n-button text>
                <n-icon size="22" :component="CopyIcon" />
            </n-button>
            <n-divider vertical />
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
            <n-button v-else text @click="handleGenerateTTS()">
                <n-spin v-if="isLoading" :size="22" />
                <n-icon v-else size="22" :component="SpeakerIcon" />
            </n-button>
            <n-divider vertical />
            <n-button>翻译</n-button>
            <n-select
                placeholder="推荐使用非推理模型"
                class="w-75"
                v-model:value="llmID"
                :options="llmOptions"
            />
        </div>
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
} from '@vicons/fluent'
// import {GTranslateOutlined as GTranslateOutlinedIcon} from '@vicon'

import { computed, ref } from 'vue'

const props = defineProps<{
    selectedText: string
}>()

const userStore = useUserStore()
const message = useMessage()
const llmID = ref()
const llmOptions = computed(() => {
    return userStore.user!.config.llm.items.map((llm) => {
        return {
            label: llm.name,
            value: llm.id,
        }
    })
})

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
</script>
