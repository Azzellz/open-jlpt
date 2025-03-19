import { defineComponent } from 'vue'
import { NMenu, NIcon, type MenuOption } from 'naive-ui'
import { type Component, computed } from 'vue'
import {
    History20Regular as History20RegularIcon,
    Settings20Regular as Settings20RegularIcon,
} from '@vicons/fluent'
import { User as UserIcon } from '@vicons/carbon'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import AppLayout from '@/components/app/AppLayout'

function renderIcon(icon: Component) {
    return () => <NIcon component={icon} />
}
function renderRouterLink(to: string, label: string) {
    return () => <RouterLink to={to}> {label} </RouterLink>
}

function UserViewMenu() {
    const { t } = useI18n()
    const route = useRoute()

    const menuOptions = computed<MenuOption[]>(() => {
        return [
            {
                label: renderRouterLink('/user/profile', t('user.menu.profile')),
                key: '/user/profile',
                icon: renderIcon(UserIcon),
            },
            {
                label: renderRouterLink('/user/setting', t('user.menu.setting')),
                key: '/user/setting',
                icon: renderIcon(Settings20RegularIcon),
            },
            {
                label: t('user.menu.history'),
                key: 'history',
                icon: renderIcon(History20RegularIcon),
                children: [
                    {
                        label: renderRouterLink('/user/history/read', t('jlpt.read')),
                        key: '/user/history/read',
                        icon: renderIcon(BookIcon),
                    },
                ],
            },
        ]
    })

    return (
        <NMenu
            class="py-2"
            value={route.path}
            defaultExpandAll
            collapsedWidth={64}
            collapsedIconSize={22}
            options={menuOptions.value}
        />
    )
}

export default defineComponent(() => {
    return () => <AppLayout sider={UserViewMenu} contentClass="p-10" />
})
