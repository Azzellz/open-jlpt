import { defineComponent, KeepAlive, type VNode } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent(() => {
    return () => (
        <RouterView>
            {{
                default: ({ Component }: { Component: () => VNode }) => {
                    return (
                        <KeepAlive>
                            <Component />
                        </KeepAlive>
                    )
                },
            }}
        </RouterView>
    )
})
