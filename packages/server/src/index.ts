import { Elysia } from 'elysia'
import { AI_Service } from './services'
import { cors } from '@elysiajs/cors'
import '@/db'

const app = new Elysia().use(cors()).use(AI_Service).listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
