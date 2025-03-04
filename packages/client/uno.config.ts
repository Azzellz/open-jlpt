import { defineConfig, transformerDirectives } from 'unocss'

export default defineConfig({
    transformers: [transformerDirectives()],
    shortcuts: {
        'app-content': 'flex-1 overflow-auto',
        reactive: 'lg:px-35 xl:px-70',
        'flex-y': 'flex flex-col',
        'flex-x': 'flex flex-row',
    },
})
