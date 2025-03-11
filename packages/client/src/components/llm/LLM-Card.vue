<template>
    <n-card :title="llm.name" hoverable>
        <template #header-extra>
            <div class="flex items-center">
                <n-button text @click="emit('edit', llm)">
                    <n-icon size="24" :component="CalendarEdit20RegularIcon" />
                </n-button>
                <n-divider vertical />
                <n-button text @click="emit('delete', llm)">
                    <n-icon size="24" :component="Delete20RegularIcon" />
                </n-button>
            </div>
        </template>
        <div class="flex flex-col gap-1 text-gray">
            <div>ApiKey: {{ llm.apiKey }}</div>
            <div>BaseURL: {{ llm.baseURL }}</div>
            <div>ModelID: {{ llm.modelID }}</div>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import type { LLM_Config } from '@root/models'
import { NCard, NButton, NIcon, NDivider } from 'naive-ui'
import {
    CalendarEdit20Regular as CalendarEdit20RegularIcon,
    Delete20Regular as Delete20RegularIcon,
} from '@vicons/fluent'

defineProps<{
    llm: LLM_Config
}>()

const emit = defineEmits<{
    edit: [llm: LLM_Config]
    delete: [llm: LLM_Config]
}>()
</script>
