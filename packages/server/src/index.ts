import { Elysia } from 'elysia'
import { UserService, AuthService, JLPT_Service } from './services'
import { cors } from '@elysiajs/cors'
import { formatResponsePlugin } from './plugins'
import '@/db'

const app = new Elysia()
    .use(cors())
    .use(formatResponsePlugin)
    .use(UserService)
    .use(AuthService)
    .use(JLPT_Service)
    .listen({
        hostname: '0.0.0.0',
        port: 3000,
    })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
