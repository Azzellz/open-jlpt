import { Elysia } from 'elysia'
import { AI_Service } from './services'

const app = new Elysia().use(AI_Service).listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
