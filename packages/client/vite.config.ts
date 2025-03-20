import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0', // 配置项目可以局域网访问
        cors: true, // 默认启用并允许任何源
    },
    plugins: [
        vue(),
        tsxResolveTypes(),
        vueJsx(),
        vueDevTools(),
        UnoCSS(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'OpenJLPT',
                short_name: 'OpenJLPT',
                description:
                    'An AI-powered platform for learning JLPT that supports all JLPT question types and personalized learning content.',
                theme_color: '#ffffff',
                // icons: [
                //     {
                //         src: 'pwa-192x192.png',
                //         sizes: '192x192',
                //         type: 'image/png',
                //     },
                //     {
                //         src: 'pwa-512x512.png',
                //         sizes: '512x512',
                //         type: 'image/png',
                //     },
                // ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
