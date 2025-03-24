import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'
import { RouterView } from 'vue-router'
import type { JSX } from 'vue/jsx-runtime'

interface Props {
    sider: () => JSX.Element
    footer: () => JSX.Element
    contentClass?: string
}
export default function AppLayout(props: Props) {
    return (
        <NLayout class="flex-1" hasSider={true}>
            <NLayoutSider
                class="max-md:hidden"
                bordered
                collapseMode="width"
                collapsedWidth={64}
                width={200}
                showTrigger={true}
            >
                <props.sider />
            </NLayoutSider>
            <NLayoutContent>
                <main class="h-full flex-y">
                    <RouterView class={props.contentClass || '' + ' app-content mb-2.5 '} />
                    <div class="md:hidden mt-auto mb-7.5">
                        <props.footer />
                    </div>
                </main>
            </NLayoutContent>
        </NLayout>
    )
}
