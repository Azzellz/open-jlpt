<template>
    <header class="h-16 shadow-md z-10">
        <div class="px-8 h-16 flex items-center gap-10">
            <RouterLink
                to="/"
                class="h-full text-lg cursor-pointer transition flex items-center px-2"
                active-class="active-nav-item"
            >
                <SakuraIcon class="mb-1.5 mr-2" size="24" />
                <span class="text-gray">OPEN</span>
                <span class="text-red-300">·</span>
                <span class="text-red">JLPT</span>
            </RouterLink>
            <nav class="h-full ml-auto flex items-center font-bold">
                <RouterLink to="/jlpt/text" class="nav-item" active-class="active-nav-item">
                    文字
                </RouterLink>
                <RouterLink to="/jlpt/vocabulary" class="nav-item" active-class="active-nav-item">
                    词汇
                </RouterLink>
                <RouterLink to="/jlpt/grammar" class="nav-item" active-class="active-nav-item">
                    语法
                </RouterLink>
                <RouterLink to="/jlpt/read" class="nav-item" active-class="active-nav-item">
                    阅读
                </RouterLink>
                <RouterLink to="/jlpt/hearing" class="nav-item" active-class="active-nav-item">
                    听力
                </RouterLink>
                <!-- i18n -->
                <n-button
                    class="h-2/5 mx-5 px-3 border-x-1.5 border-x-gray-300 border-x-solid"
                    text
                >
                    <I18nIcon size="22" />
                </n-button>
                <RouterLink
                    class="px-2 block h-16 flex items-center"
                    to="/user/profile"
                    active-class="active-nav-item"
                >
                    <n-avatar
                        round
                        size="small"
                        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    />
                </RouterLink>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
import { NAvatar, NButton } from 'naive-ui'
import SakuraIcon from '@/components/icon/SakuraIcon.vue'
import SettingIcon from '@/components/icon/SettingIcon.vue'
import I18nIcon from '../icon/I18nIcon.vue'
</script>

<style scoped>
.nav-item {
    @apply cursor-pointer px-5 block whitespace-nowrap h-16 line-height-16;
    @apply hover:text-red-300 transition;
}
.active-nav-item {
    @apply text-red-300 border-b-2 border-b-red-300 border-b-solid transition;
}
</style>
