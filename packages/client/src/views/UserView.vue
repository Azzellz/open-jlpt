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
        <UserSetting />
    </div>
</template>

<script setup lang="ts">
import CalendarHeatmap from '@/components/jlpt/CalendarHeatmap.vue'
import UserSetting from '@/components/user/UserSetting.vue'
import { NAvatar, NCard } from 'naive-ui'
import { ref } from 'vue'

const records = ref([
    { date: '2025-02-25', completed: true },
    { date: '2025-01-02', completed: true },
    // ...其他打卡记录
])
</script>

<style scoped></style>
