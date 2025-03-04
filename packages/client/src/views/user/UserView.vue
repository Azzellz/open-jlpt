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
            <main class="flex-y gap-10 p-10">
                <router-view />
            </main>
        </n-layout-content>
    </n-layout>
</template>

<script setup lang="tsx">
import { NMenu, NIcon, NLayoutSider, NLayout, NLayoutContent } from 'naive-ui'
import { ref, h, type Component } from 'vue'
import {
    History20Regular as History20RegularIcon,
    Settings20Regular as Settings20RegularIcon,
} from '@vicons/fluent'
import { User as UserIcon } from '@vicons/carbon'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

//#region 菜单

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink(to: string, label: string) {
    return () => <RouterLink to={to}> {label} </RouterLink>
}

const activeKey = ref('profile')
const menuOptions: MenuOption[] = [
    {
        label: renderRouterLink('/user/profile', '用户资料'),
        key: 'profile',
        icon: renderIcon(UserIcon),
    },
    {
        label: renderRouterLink('/user/setting', '用户设置'),
        key: 'setting',
        icon: renderIcon(Settings20RegularIcon),
    },
    {
        label: renderRouterLink('/user/history', '历史记录'),
        key: 'history',
        icon: renderIcon(History20RegularIcon),
    },
]

//#endregion
</script>
