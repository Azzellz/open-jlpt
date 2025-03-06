import { verifyCommonUserPlugin } from '@/plugins'
import Elysia from 'elysia'
import { EdgeTTS_Service } from './edge-tts'

export const TTS_Service = new Elysia({ prefix: '/tts' })
    .use(verifyCommonUserPlugin)
    .use(EdgeTTS_Service)
