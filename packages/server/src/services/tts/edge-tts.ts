import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import { getVoices, tts } from 'edge-tts'
import Elysia, { t } from 'elysia'

export const EdgeTTS_Service = new Elysia({ prefix: '/edge-tts' })

// 生成音频
EdgeTTS_Service.post(
    '/',
    async ({ body }) => {
        try {
            return await tts(body.text, {
                voice: body.voice,
                volume: body.volume,
                rate: body.rate,
                pitch: body.pitch,
            })
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: t.Object({
            text: t.String(),
            voice: t.String(),
            volume: t.Optional(t.String()),
            rate: t.Optional(t.String()),
            pitch: t.Optional(t.String()),
        }),
    }
)

// 获取音频列表
EdgeTTS_Service.get('/voices', async () => {
    try {
        return createSuccessResponse(200, '获取音频列表成功', await getVoices())
    } catch (error) {
        Log.error(error)
        return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
    }
})
