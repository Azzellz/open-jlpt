import { defineComponent } from 'vue'
import { NMenu, NIcon, NLayoutSider, NLayout, NLayoutContent } from 'naive-ui'
import { ref, h, type Component, computed } from 'vue'
import {
    History20Regular as History20RegularIcon,
    Settings20Regular as Settings20RegularIcon,
} from '@vicons/fluent'
import { User as UserIcon } from '@vicons/carbon'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
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
    return () => (
        <NLayout hasSider={true}>
            <NLayoutSider
                bordered
                collapseMode="width"
                collapsedWidth={64}
                width={200}
                showTrigger={true}
            >
                <NMenu
                    class="py-2"
                    v-model:value={activeKey.value}
                    collapsedWidth={64}
                    collapsedIconSize={22}
                    options={menuOptions.value}
                />
            </NLayoutSider>
            <NLayoutContent>
                <main class="flex-y gap-10 p-10 lg:px-35">
                    <RouterView />
                </main>
            </NLayoutContent>
        </NLayout>
    )
})
