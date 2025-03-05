import { DB_UserModel, RedisClient } from '@/db'
import { createErrorResponse, createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'
import { omit, pick } from 'radash'
import { accessJwtPlugin, refreshJwtPlugin, verifyCommonUserPlugin } from '@/plugins'
import { nanoid } from 'nanoid'
import OpenAI from 'openai'

export const UserService = new Elysia({ prefix: '/users' })
    .use(accessJwtPlugin)
    .use(refreshJwtPlugin)

// 需要认证的部分
const VerifyUserService = new Elysia().use(verifyCommonUserPlugin)

//#region LLM服务

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

VerifyUserService.post(
    '/:userID/llms/:llmID/chat',
    async function* ({ params: { userID, llmID }, body: { messages } }) {
        if (!isValidObjectId(userID)) {
            return ERROR_RESPONSE.SYSTEM.INVALID_OBJECTID
        }
        try {
            const user = await DB_UserModel.findById(userID)
            if (!user) {
                return ERROR_RESPONSE.SYSTEM.NOT_FOUND
            }

            const llm = user.config.llm.items.find((item) => item.id === llmID)
            if (!llm) {
                return ERROR_RESPONSE.SYSTEM.NOT_FOUND
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

//#endregion

//#region 查询
VerifyUserService.get('/self', async ({ store: { user } }) => {
    try {
        const result = await DB_UserModel.findById(user.id)
        if (result) {
            return createSuccessResponse(200, '查询用户成功', omit(result.toJSON(), ['password']))
        } else {
            return createErrorResponse(404, '未查询到用户')
        }
    } catch (error) {
        Log.error(error)
        return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
    }
})

VerifyUserService.get(
    '/',
    async ({ query }) => {
        try {
            const filter: Record<string, any> = {}
            Object.entries(query || {}).forEach(([key, value]) => {
                if (key === 'id' && isValidObjectId(value)) {
                    filter['_id'] = value
                } else if (value) {
                    // 模糊搜索
                    filter[key] = {
                        $regex: value,
                        $options: 'i', // 可选：不区分大小写
                    }
                }
            })
            const users = await DB_UserModel.find(filter)
            return createSuccessResponse(
                200,
                'OK',
                users.map((user) => omit(user.toJSON(), ['password', 'config'])) // 要隐藏一些隐私数据
            )
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        query: t.Object({
            id: t.Optional(t.String()),
            name: t.Optional(t.String()),
            account: t.Optional(t.String()),
        }),
    }
)

//#endregion

//#region 注册

UserService.post(
    '/',
    async ({ body, accessJwt, refreshJwt }) => {
        try {
            // 检查是否有重复用户
            if (await DB_UserModel.findOne({ name: body.name })) {
                return createErrorResponse(409, '存在重复用户名')
            }

            // 对密码加密
            const salt = await bcrypt.genSalt(10)
            body.password = await bcrypt.hash(body.password, salt)

            // 创建新用户
            const newUser = await DB_UserModel.create({
                ...body,
                avatar: 'default',
                histories: { reads: [] },
                favorites: { reads: [] },
                publishes: { reads: [] },
                config: {
                    llms: [],
                },
            })

            const userJson = omit(newUser.toJSON(), ['password'])
            const userPayload = pick(userJson, ['id', 'name', 'account'])

            // 生成访问令牌
            const accessToken = await accessJwt.sign({
                ...userPayload,
                _random: nanoid(),
            })

            // 记录 refreshToken(刷新令牌) 到 Redis，7天过期
            const refreshToken = await refreshJwt.sign({ ...userPayload, _random: nanoid() })
            RedisClient.setEx(`sessions:${userJson.id}`, 3600 * 24 * 7, refreshToken)

            return createSuccessResponse(200, '注册成功', {
                user: userJson,
                token: accessToken,
            })
        } catch (error) {
            return createErrorResponse(500, error)
        }
    },
    {
        body: t.Object({
            name: t.String(),
            account: t.String(),
            password: t.String(),
        }),
    }
)

//#endregion

//#region 更新

// 更新基本信息
VerifyUserService.put(
    '/:id',
    async ({ params: { id }, body }) => {
        if (!isValidObjectId(id)) {
            return ERROR_RESPONSE.SYSTEM.INVALID_OBJECTID
        }
        try {
            const user = await DB_UserModel.findByIdAndUpdate(id, body, { new: true })
            if (!user) {
                return ERROR_RESPONSE.SYSTEM.NOT_FOUND
            }

            return createSuccessResponse(
                200,
                '用户信息更新成功',
                pick(user.toJSON(), ['name', 'avatar', 'config'])
            )
        } catch (error) {
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: t.Object({
            name: t.Optional(t.String()),
            avatar: t.Optional(t.String()),
            password: t.Optional(t.String()),
            config: t.Optional(
                t.Object({
                    llm: t.Optional(
                        t.Object({
                            items: t.Optional(
                                t.Array(
                                    t.Object({
                                        id: t.String(),
                                        name: t.String(),
                                        apiKey: t.String(),
                                        baseURL: t.String(),
                                        modelID: t.String(),
                                    })
                                )
                            ),
                            default: t.Optional(t.String()),
                        })
                    ),
                })
            ),
        }),
    }
)

//#endregion

// 合并认证部分
UserService.use(VerifyUserService)
