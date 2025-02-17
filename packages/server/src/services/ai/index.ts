import Elysia from 'elysia'
import { AI_DeepSeekService } from './deepseek'

export const AI_Service = new Elysia({
    prefix: 'ai',
}).use(AI_DeepSeekService)
