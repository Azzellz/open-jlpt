<template>
    <div class="h-16 px-8 shadow-md z-10 flex items-center gap-10">
        <RouterLink to="/" class="text-lg cursor-pointer transition hover:scale-120">
            <span class="text-gray">OPEN</span>
            <span class="text-red-300">·</span>
            <span class="text-red">JLPT</span>
        </RouterLink>
        <div
            class="ml-auto flex items-center gap-10 font-bold pr-10 border-r-1.5 border-gray-300 border-r-solid"
        >
            <RouterLink
                to="/jlpt/text"
                class="hover:text-red-300 cursor-pointer transition hover:scale-110"
                active-class=" text-red-300"
            >
                文字
            </RouterLink>
            <RouterLink
                to="/jlpt/vocabulary"
                class="hover:text-red-300 cursor-pointer transition hover:scale-110"
                active-class=" text-red-300"
            >
                词汇
            </RouterLink>
            <RouterLink
                to="/jlpt/grammar"
                class="hover:text-red-300 cursor-pointer transition hover:scale-110"
                active-class=" text-red-300"
            >
                语法
            </RouterLink>
            <RouterLink
                to="/jlpt/read"
                class="hover:text-red-300 cursor-pointer transition hover:scale-110"
                active-class=" text-red-300"
            >
                阅读
            </RouterLink>
            <RouterLink
                to="/jlpt/hearing"
                class="hover:text-red-300 cursor-pointer transition hover:scale-110"
                active-class=" text-red-300"
            >
                听力
            </RouterLink>
        </div>
        <div class="flex justify-center pl-10 border-l-1.5 border-gray-300 border-l-solid">
            <n-avatar
                round
                size="small"
                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { NAvatar, NDivider } from 'naive-ui'
</script>
