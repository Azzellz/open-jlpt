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

function createMenuOption(options: {
    icon: Component
    label: string
    to: string
    children?: MenuOption[]
}): MenuOption {
    return {
        label: () => (
            <div class="flex-y h-full items-center">
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
    const readStore = useJLPTReadStore()

    const menuOptions = computed<MenuOption[]>(() => {
        return [
            createMenuOption({ icon: GenerateIcon, label: '生成阅读', to: '/jlpt/read/generate' }),
            createMenuOption({
                icon: HubIcon,
                label: '阅读广场',
                to: '/jlpt/read/hub',
                children: readStore.historyRecords.length
                    ? readStore.historyRecords.map((read) => {
                          return createMenuOption({
                              icon: BookIcon,
                              label: read.article.title,
                              to: `/jlpt/read/detail/${read.id}`,
                          })
                      })
                    : void 0,
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
