import { defineComponent } from 'vue'
import { NMenu, type MenuOption } from 'naive-ui'
import { computed } from 'vue'
import { ChannelShare20Regular as HubIcon } from '@vicons/fluent'
import { AiStatusInProgress as GenerateIcon } from '@vicons/carbon'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/app/AppLayout'
import { useJLPTReadStore } from '@/stores/jlpt/read'
import { createMenuOption } from '@/utils'

export default defineComponent(() => {
    const { t } = useI18n()
    const route = useRoute()
    const readStore = useJLPTReadStore()

    const desktopMenuOptions = computed<MenuOption[]>(() => {
        return [
            createMenuOption({
                type: 'desktop',
                icon: GenerateIcon,
                label: '生成阅读',
                to: '/jlpt/read/generate',
            }),
            createMenuOption({
                type: 'desktop',
                icon: HubIcon,
                label: '阅读广场',
                to: '/jlpt/read/hub',
                children: readStore.historyRecords.length
                    ? readStore.historyRecords.map((read) => {
                          return createMenuOption({
                              type: 'desktop',
                              icon: BookIcon,
                              label: read.article.title,
                              to: `/jlpt/read/detail/${read.id}`,
                          })
                      })
                    : void 0,
            }),
        ]
    })
    const mobileMenuOptions = computed<MenuOption[]>(() => {
        return [
            createMenuOption({
                type: 'mobile',
                icon: GenerateIcon,
                label: '生成阅读',
                to: '/jlpt/read/generate',
            }),
            createMenuOption({
                type: 'mobile',
                icon: HubIcon,
                label: '阅读广场',
                to: '/jlpt/read/hub',
                children: readStore.historyRecords.length
                    ? readStore.historyRecords.map((read) => {
                          return createMenuOption({
                              type: 'desktop',
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
