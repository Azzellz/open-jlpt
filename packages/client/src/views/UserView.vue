<template>
    <div class="flex flex-col gap-10">
        <!-- 用户资料 -->
        <div class="flex gap-10">
            <div class="flex-1/3 flex flex-col">
                <n-avatar
                    round
                    :size="256"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                <div class="mt-10 text-xl font-bold">OpenJLPT</div>
                <div class="text-xl text-gray font-light">YuzuTea</div>
                <div class="mt-4">Code for code. Live for life. Tyee my tea</div>
            </div>
            <div class="flex-2/3">
                <n-card class="h-full">
                    <CalendarHeatmap :records="records" :year="2025" />
                </n-card>
            </div>
        </div>
        <!-- 设置 -->
        <div class="flex flex-col gap-10">
            <div>
                <div class="flex items-center">
                    <SettingIcon size="64" />
                    <div class="setting-item-title">通用设置</div>
                </div>
                <n-divider />
            </div>
            <div class="flex flex-col">
                <div class="ml-3 flex items-center gap-2">
                    <AiIcon size="40"></AiIcon>
                    <div class="setting-item-title">AI模型设置</div>
                </div>
                <n-divider />
                <div class="flex flex-col gap-5">
                    <!-- 默认模型配置 -->
                    <div class="flex flex-col gap-1 w-75">
                        <span class="text-gray">默认模型</span>
                        <n-select v-model:value="defaultLLMID" :options="defaultLLMOptions" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AiIcon from '@/components/icon/AiIcon.vue'
import SettingIcon from '@/components/icon/SettingIcon.vue'
import CalendarHeatmap from '@/components/jlpt/CalendarHeatmap.vue'
import { useConfigStore } from '@/stores/config'
import { NDivider, NSelect, NAvatar, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

const configStore = useConfigStore()
const records = ref([
    { date: '2025-02-25', completed: true },
    { date: '2025-01-02', completed: true },
    // ...其他打卡记录
])
//#region AI模型设置

const defaultLLMID = ref()
const defaultLLMOptions = computed(() => {
    return configStore.config?.llms.map((llm) => {
        return {
            label: llm.name,
            value: llm.id,
        }
    })
})

//#endregion
</script>

<style scoped>
.setting-item-title {
    @apply text-4xl font-bold;
}
</style>
