import Elysia, { t } from 'elysia'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import OpenAI from 'openai'
import { DB_ConfigModel } from '@/db'
import { OpenJLPT_LLM } from '@root/models'

const SessionMap: Record<
    string,
    {
        client: OpenAI
        llm: OpenJLPT_LLM
    }
> = {}

interface StreamChatParams {
    /**
     * 是否包含推理过程
     */
    client: OpenAI
    modelID: string
    includeResponing?: boolean
    messages: {
        role: 'user' | 'system'
        content: string
    }[]
}

/**
 * 流式对话
 */
async function streamChat({
    client,
    modelID,
    messages,
    includeResponing = true,
}: StreamChatParams) {
    return await client.chat.completions.create({
        messages,
        model: modelID,
        stream: true,
        stream_options: {
            include_usage: includeResponing, // 是否包含推理过程
        },
    })
}

export const LLM_Service = new Elysia({
    prefix: 'llm',
})

LLM_Service.post(
    '/:id/chat',
    async function* ({ body: { messages, isStream }, params: { id } }) {
        try {
            // 初始化客户端
            if (!SessionMap[id]) {
                const config = await DB_ConfigModel.findOne()
                if (!config) {
                    return createErrorResponse(400, '配置文件未初始化')
                }
                const target = config.llms.find((item) => item.id === id)
                if (!target) {
                    return createErrorResponse(400, 'modelID错误，未找到对应模型')
                }

                SessionMap[id] = {
                    client: new OpenAI(target),
                    llm: target,
                }
            }
            const stream = await streamChat({
                client: SessionMap[id].client,
                modelID: SessionMap[id].llm.modelID,
                messages,
            })
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
