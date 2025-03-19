import { defineComponent, ref } from 'vue'
import { NMenu, NIcon, type MenuOption } from 'naive-ui'
import { type Component, computed } from 'vue'
import { ChannelShare20Regular as HubIcon } from '@vicons/fluent'
import { AiStatusInProgress as GenerateIcon } from '@vicons/carbon'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/app/AppLayout'

function renderIcon(icon: Component) {
    return () => <NIcon component={icon} />
}
function renderRouterLink(to: string, label: string) {
    return () => <RouterLink to={to}> {label} </RouterLink>
}

function JLPT_ReadViewMenu() {
    const { t } = useI18n()
    const route = useRoute()

    const menuOptions = computed<MenuOption[]>(() => {
        return [
            {
                label: renderRouterLink('/jlpt/read/generate', '生成阅读'),
                key: '/jlpt/read/generate',
                icon: renderIcon(GenerateIcon),
            },
            {
                label: renderRouterLink('/jlpt/read/hub', '阅读广场'),
                key: '/jlpt/read/hub',
                icon: renderIcon(HubIcon),
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
    return () => <AppLayout sider={JLPT_ReadViewMenu} />
})
