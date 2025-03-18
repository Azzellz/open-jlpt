import { defineComponent } from 'vue'
import { NMenu, NIcon, NLayoutSider, NLayout, NLayoutContent, type MenuOption } from 'naive-ui'
import { ref, h, type Component, computed } from 'vue'
import {
    History20Regular as History20RegularIcon,
    Settings20Regular as Settings20RegularIcon,
} from '@vicons/fluent'
import { User as UserIcon } from '@vicons/carbon'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BookOutline as BookIcon } from '@vicons/ionicons5'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink(to: string, label: string) {
    return () => <RouterLink to={to}> {label} </RouterLink>
}

function UserViewMenu() {
    const { t } = useI18n()

    const menuOptions = computed<MenuOption[]>(() => {
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
                label: t('user.menu.history'),
                key: 'history',
                icon: renderIcon(History20RegularIcon),
                children: [
                    {
                        label: renderRouterLink('/user/history/read', t('jlpt.read')),
                        icon: renderIcon(BookIcon),
                        key: 'read',
                    },
                ],
            },
        ]
    })

    return (
        <NMenu
            class="py-2"
            defaultValue="profile"
            defaultExpandAll
            collapsedWidth={64}
            collapsedIconSize={22}
            options={menuOptions.value}
        />
    )
}

export default defineComponent(() => {
    return () => (
        <NLayout hasSider={true}>
            <NLayoutSider
                bordered
                collapseMode="width"
                collapsedWidth={64}
                width={200}
                showTrigger={true}
            >
                <UserViewMenu />
            </NLayoutSider>
            <NLayoutContent>
                <main class="h-full flex-y gap-10 p-10 lg:px-35">
                    <RouterView />
                </main>
            </NLayoutContent>
        </NLayout>
    )
})
