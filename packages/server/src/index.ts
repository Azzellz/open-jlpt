import { Elysia } from 'elysia'
import { LLM_Service, ConfigService } from './services'
import { cors } from '@elysiajs/cors'
import '@/db'

const app = new Elysia().use(cors()).use(LLM_Service).use(ConfigService).listen({
    hostname: '0.0.0.0',
    port: 3000,
})

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
