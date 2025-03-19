import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'
import { isFunction } from 'radash'
import { RouterView } from 'vue-router'
import type { JSX } from 'vue/jsx-runtime'

interface Props {
    sider: JSX.Element | (() => JSX.Element)
    contentClass?: string
}
export default function AppLayout(props: Props) {
    return (
        <NLayout hasSider={true}>
            <NLayoutSider
                bordered
                collapseMode="width"
                collapsedWidth={64}
                width={200}
                showTrigger={true}
            >
                {isFunction(props.sider) ? <props.sider /> : props.sider}
            </NLayoutSider>
            <NLayoutContent>
                <main class="h-full">
                    <RouterView class={props.contentClass || ''} />
                </main>
            </NLayoutContent>
        </NLayout>
    )
}
