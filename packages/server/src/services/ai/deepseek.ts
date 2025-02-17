import Elysia, { t } from 'elysia'
import AI from '@/ai'
import { createErrorResponse, createSuccessResponse } from '@root/shared'

export const AI_DeepSeekService = new Elysia({ prefix: 'deepseek' })

AI_DeepSeekService.post(
    '/chat',
    async function* ({ body: { messages, isStream: isStream } }) {
        try {
            const stream = await AI.DeepSeek.streamChat({ messages })
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta
                const reasoning = (delta as any)?.reasoning_content
                const content = delta?.content
                let data: any
                if (reasoning) {
                    data = {
                        type: 'reasoning',
                        content: reasoning,
                    }
                } else {
                    data = {
                        type: 'content',
                        content,
                    }
                }
                yield createSuccessResponse(200, 'OK', data)
            }
        } catch (error) {
            return createErrorResponse(500, error)
        }
    },
    {
        body: t.Object({
            isStream: t.Boolean(),
            messages: t.Array(
                t.Object({
                    role: t.Union([t.Literal('user'), t.Literal('system')]),
                    content: t.String(),
                })
            ),
        }),
    }
)
