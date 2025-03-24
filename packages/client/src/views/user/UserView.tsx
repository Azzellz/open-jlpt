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

function createMenuOption(options: {
    icon: Component
    label: string
    to: string
    children?: MenuOption[]
}): MenuOption {
    return {
        label: () => (
            <div class="flex-y items-center">
                <NIcon size="24" component={options.icon} />
                <RouterLink to={options.to}> {options.label} </RouterLink>
            </div>
        ),
        key: options.to,
    }
}

export default defineComponent(() => {
    const { t } = useI18n()
    const route = useRoute()
    const menuOptions = computed<MenuOption[]>(() => {
        return [
            createMenuOption({
                icon: UserIcon,
                label: t('user.menu.profile'),
                to: '/user/profile',
            }),
            createMenuOption({
                icon: Settings20RegularIcon,
                label: t('user.menu.setting'),
                to: '/user/setting',
            }),
            createMenuOption({
                icon: History20RegularIcon,
                label: t('user.menu.history'),
                to: 'history',
                children: [
                    createMenuOption({
                        icon: BookIcon,
                        label: t('jlpt.read'),
                        to: '/user/history/read',
                    }),
                ],
            }),
        ]
    })
    return () => (
        <AppLayout
            contentClass="p-10"
            sider={() => (
                <NMenu
                    class="py-2"
                    value={route.path}
                    defaultExpandAll
                    collapsedWidth={64}
                    collapsedIconSize={22}
                    options={menuOptions.value}
                    rootIndent={36}
                    indent={0}
                />
            )}
            footer={() => (
                <div class="mx-6 rounded-full p-2 oj-shadow">
                    <NMenu
                        class="mb-2 py-2"
                        value={route.path}
                        options={menuOptions.value}
                        mode="horizontal"
                    />
                </div>
            )}
        />
    )
})
