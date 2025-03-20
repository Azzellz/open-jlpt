import { defineComponent } from 'vue'
import { NMenu, NIcon, type MenuOption } from 'naive-ui'
import { type Component, computed } from 'vue'
import { ChannelShare20Regular as HubIcon } from '@vicons/fluent'
import { AiStatusInProgress as GenerateIcon } from '@vicons/carbon'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/app/AppLayout'
import { useJLPTReadStore } from '@/stores/jlpt/read'

function renderIcon(icon: Component) {
    return () => <NIcon component={icon} />
}
function renderRouterLink(to: string, label: string) {
    return () => <RouterLink to={to}> {label} </RouterLink>
}

function JLPT_ReadViewMenu() {
    const { t } = useI18n()
    const route = useRoute()
    const readStore = useJLPTReadStore()

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
                children: readStore.historyRecords.length
                    ? readStore.historyRecords.map((read) => {
                          return {
                              label: renderRouterLink(
                                  `/jlpt/read/detail/${read.id}`,
                                  read.article.title,
                              ),
                              key: `/jlpt/read/detail/${read.id}`,
                              icon: renderIcon(BookIcon),
                          }
                      })
                    : void 0,
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
            rootIndent={36}
            indent={0}
        />
    )
}

export default defineComponent(() => {
    return () => <AppLayout sider={JLPT_ReadViewMenu} />
})
