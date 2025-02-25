<template>
    <div class="pb-2 h-30 flex gap-2">
        <n-input-group>
            <n-button>复制</n-button>
            <n-button>翻译</n-button>
            <n-select class="w-75" v-model:value="llmID" :options="llmOptions"></n-select>
        </n-input-group>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { NButton, NSelect, NInputGroup } from 'naive-ui'
import { computed, ref } from 'vue'

defineProps<{
    selectedText: string
}>()

const configStore = useConfigStore()
const llmID = ref()
const llmOptions = computed(() => {
    return configStore.config?.llms.map((llm) => {
        return {
            label: llm.name,
            value: llm.id,
        }
    })
})
</script>

<style scoped></style>
