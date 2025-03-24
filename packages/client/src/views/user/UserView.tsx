import { defineComponent } from 'vue'
import { NMenu, type MenuOption } from 'naive-ui'
import { computed } from 'vue'
import {
    History20Regular as History20RegularIcon,
    Settings20Regular as Settings20RegularIcon,
} from '@vicons/fluent'
import { User as UserIcon } from '@vicons/carbon'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import AppLayout from '@/components/app/AppLayout'
import { createMenuOption } from '@/utils'

export default defineComponent(() => {
    const { t } = useI18n()
    const route = useRoute()
    const desktopMenuOptions = computed<MenuOption[]>(() => {
        return [
            createMenuOption({
                type: 'desktop',
                icon: UserIcon,
                label: t('user.menu.profile'),
                to: '/user/profile',
            }),
            createMenuOption({
                type: 'desktop',
                icon: Settings20RegularIcon,
                label: t('user.menu.setting'),
                to: '/user/setting',
            }),
            createMenuOption({
                type: 'desktop',
                icon: History20RegularIcon,
                label: t('user.menu.history'),
                to: '/user/history',
                children: [
                    createMenuOption({
                        type: 'desktop',
                        icon: BookIcon,
                        label: t('jlpt.read'),
                        to: '/user/history/read',
                    }),
                ],
            }),
        ]
    })
    const mobileMenuOptions = computed<MenuOption[]>(() => {
        return [
            createMenuOption({
                type: 'mobile',
                icon: UserIcon,
                label: t('user.menu.profile'),
                to: '/user/profile',
            }),
            createMenuOption({
                type: 'mobile',
                icon: Settings20RegularIcon,
                label: t('user.menu.setting'),
                to: '/user/setting',
            }),
            createMenuOption({
                type: 'mobile',
                icon: History20RegularIcon,
                label: t('user.menu.history'),
                to: '/user/history',
                children: [
                    createMenuOption({
                        type: 'desktop',
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
            sider={() => (
                <NMenu
                    class="py-2"
                    value={route.path}
                    defaultExpandAll
                    collapsedWidth={64}
                    collapsedIconSize={22}
                    options={desktopMenuOptions.value}
                    rootIndent={36}
                    indent={0}
                />
            )}
            footer={() => (
                <div class="mx-6 rounded-full p-2 oj-shadow">
                    <NMenu
                        class="mb-2 py-2 justify-center"
                        value={route.path}
                        options={mobileMenuOptions.value}
                        mode="horizontal"
                    />
                </div>
            )}
        />
    )
})
