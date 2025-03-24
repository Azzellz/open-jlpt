import { defineConfig, transformerDirectives } from 'unocss'

export default defineConfig({
    transformers: [transformerDirectives()],
    shortcuts: {
        reactive: 'px-2.5 py-5 md:px-35 xl:px-70',
        'app-content': 'flex-1 overflow-auto reactive flex-y',
        'flex-y': 'flex flex-col',
        'flex-x': 'flex flex-row',
    },
})
