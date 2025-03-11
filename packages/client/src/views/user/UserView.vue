<template>
    <n-layout has-sider>
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="200"
            show-trigger
        >
            <n-menu
                class="py-2"
                v-model:value="activeKey"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
            />
        </n-layout-sider>
        <n-layout-content>
            <main class="flex-y gap-10 p-10 lg:px-35">
                <router-view />
            </main>
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="tsx">
import { NMenu, NIcon, NLayoutSider, NLayout, NLayoutContent } from 'naive-ui'
import { ref, h, type Component, computed } from 'vue'
import {
    History20Regular as History20RegularIcon,
    Settings20Regular as Settings20RegularIcon,
} from '@vicons/fluent'
import { User as UserIcon } from '@vicons/carbon'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

//#region 菜单

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink(to: string, label: string) {
    return () => <RouterLink to={to}> {label} </RouterLink>
}

const activeKey = ref('profile')
const menuOptions = computed(() => {
    return [
        {
            label: renderRouterLink('/user/profile', t('user.menu.profile')),
            key: 'profile',
            icon: renderIcon(UserIcon),
        },
        {
            label: renderRouterLink('/user/setting', t('user.menu.setting')),
            key: 'setting',
            icon: renderIcon(Settings20RegularIcon),
        },
        {
            label: renderRouterLink('/user/history', t('user.menu.history')),
            key: 'history',
            icon: renderIcon(History20RegularIcon),
        },
    ]
})

//#endregion
</script>
