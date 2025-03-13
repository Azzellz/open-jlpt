import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0', // 配置项目可以局域网访问
        cors: true, // 默认启用并允许任何源
    },
    plugins: [vue(), tsxResolveTypes(), vueJsx(), vueDevTools(), UnoCSS()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
