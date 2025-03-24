import { type MenuOption, NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'

interface Options {
    type: 'desktop' | 'mobile'
    icon: Component
    label: string
    to: string
    children?: MenuOption[]
}
export function createMenuOption(options: Options): MenuOption {
    if (options.type === 'desktop') {
        return {
            label: () => <RouterLink to={options.to}> {options.label} </RouterLink>,
            icon: () => <NIcon size="24" component={options.icon} />,
            key: options.to,
            children: options.children,
        }
    } else {
        return {
            label: () => (
                <div class="flex-y h-full items-center">
                    <NIcon size="28" component={options.icon} />
                    <RouterLink to={options.to}> {options.label} </RouterLink>
                </div>
            ),
            key: options.to,
            children: options.children,
        }
    }
}
