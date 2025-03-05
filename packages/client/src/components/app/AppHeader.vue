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
                    {{ $t('nav.jlpt.text') }}
                </RouterLink>
                <RouterLink to="/jlpt/vocabulary" class="nav-item" active-class="active-nav-item">
                    {{ $t('nav.jlpt.vocabulary') }}
                </RouterLink>
                <RouterLink to="/jlpt/grammar" class="nav-item" active-class="active-nav-item">
                    {{ $t('nav.jlpt.grammar') }}
                </RouterLink>
                <RouterLink to="/jlpt/read" class="nav-item" active-class="active-nav-item">
                    {{ $t('nav.jlpt.read') }}
                </RouterLink>
                <RouterLink to="/jlpt/hearing" class="nav-item" active-class="active-nav-item">
                    {{ $t('nav.jlpt.hearing') }}
                </RouterLink>

                <!-- i18n -->
                <n-popselect v-model:value="locale" :options="i18nOptions" size="medium" scrollable>
                    <n-button
                        class="h-2/5 mx-3 px-3 border-x-1.5 border-x-gray-300 border-x-solid"
                        text
                    >
                        <n-icon :component="TranslateIcon" size="30" />
                    </n-button>
                </n-popselect>

                <!-- Github -->
                <n-button class="px-3" text @click="to('https://github.com/Azzellz/open-jlpt')">
                    <n-icon :component="LogoGithubIcon" size="30" />
                </n-button>

                <!-- 用户头像交互 -->
                <RouterLink
                    class="px-2 block h-16 flex items-center"
                    to="/user/profile"
                    active-class="active-nav-item"
                >
                    <n-popselect @update:value="(v) => console.log(v)" class="p-0">
                        <template #empty>
                            <div>{{ userStore.user?.name }}</div>
                        </template>
                        <template #action>
                            <div class="flex-y items-center">
                                <n-button text @click="handleLoginout" :loading="isLoading">
                                    注销登录
                                </n-button>
                            </div>
                        </template>
                        <n-avatar
                            round
                            size="small"
                            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        />
                    </n-popselect>
                </RouterLink>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
import { NAvatar, NButton, NIcon, NPopselect, useMessage } from 'naive-ui'
import SakuraIcon from '@/components/icon/SakuraIcon.vue'
import { LogoGithub as LogoGithubIcon } from '@vicons/ionicons5'
import { Translate20Regular as TranslateIcon } from '@vicons/fluent'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { isSuccessResponse } from '@root/shared'
import { ref } from 'vue'
import API from '@/api'

const userStore = useUserStore()
const message = useMessage()

function to(href: string) {
    location.href = href
}

//#region i18n
const i18nOptions = [
    { label: '简体中文', value: 'zh' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
]

const { locale } = useI18n({ useScope: 'global' })

//#endregion

//#region 用户操作

const isLoading = ref(false)
async function handleLoginout() {
    isLoading.value = true
    const result = await API.Auth.deleteAuthSession(userStore.user!.id)
    isLoading.value = false
    if (isSuccessResponse(result)) {
        userStore.user = null
        userStore.token = ''
        localStorage.removeItem('token')
        message.success('注销成功')
    } else {
        console.error(result)
        message.error('注销失败')
    }
}
//#endregion
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
