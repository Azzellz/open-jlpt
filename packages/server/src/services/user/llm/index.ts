import { DB_UserModel } from '@/db'
import { UserModel } from '@/models/user'
import { verifyPluginReference } from '@/plugins'
import { checkUserAvailablePlugin } from '@/plugins/user'
import { LLM_Config } from '@root/models'
import { ERROR_RESPONSE, Log } from '@root/shared'
import Elysia from 'elysia'
import { isValidObjectId } from 'mongoose'
import OpenAI from 'openai'

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

export const UserLLMService = new Elysia({
    prefix: '/:userID/llms/:llmID',
})
    .use(verifyPluginReference)
    .use(checkUserAvailablePlugin())
    .use(UserModel)

UserLLMService.post(
    '/chat',
    async function* ({ params: { llmID }, store: { user }, body: { messages, custom } }) {
        try {
            let llm: Omit<LLM_Config, 'id' | 'name'> | undefined
            // 如果 custom 存在，则使用 custom 的配置
            if (custom) {
                llm = custom
            } else {
                llm = user.config.llm.items.find((item) => item.id === llmID)
                if (!llm) {
                    return ERROR_RESPONSE.SYSTEM.NOT_FOUND
                }
            }

            const client = new OpenAI(llm)
            const stream = await streamChat({
                client,
                modelID: llm.modelID,
                messages,
            })

            let isContentStage = false
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta
                const reasoning = (delta as any)?.reasoning_content
                const content = delta?.content

                // 思考部分结束，返回一段特殊字符串标识内容阶段开始
                if (reasoning === void 0 && !isContentStage) {
                    isContentStage = true
                    // "open-jlpt" 的 SHA1 哈希字符串
                    yield 'e7d974c7436c9a369b93fe49e405364b9bd3060a'
                }

                yield reasoning || content
            }
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: 'llms.chat.body',
    }
)
