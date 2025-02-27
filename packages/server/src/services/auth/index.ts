import { DB_UserModel, RedisClient } from '@/db'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import Elysia, { t } from 'elysia'
import bcrypt from 'bcryptjs'
import { omit, pick } from 'radash'
import { accessJwtPlugin, refreshJwtPlugin } from '@/plugins'
import { nanoid } from 'nanoid'

export const AuthService = new Elysia({ prefix: '/auth' })
    .use(accessJwtPlugin)
    .use(refreshJwtPlugin)

// 登陆
AuthService.post(
    '/sessions',
    async ({ body, accessJwt, refreshJwt }) => {
        try {
            // 查询用户
            const user = await DB_UserModel.findOne({ account: body.account })
            if (!user) {
                return createErrorResponse(404, '用户不存在，账号错误')
            }
            // 检查密码是否正确
            const isValidPassword = await bcrypt.compare(body.password, user.password)
            if (isValidPassword) {
                const userJson = omit(user.toJSON(), ['password'])
                const userPayload = pick(userJson, ['id', 'name', 'account'])
                // 生成 tokens
                const token = await accessJwt.sign({
                    ...userPayload,
                    _random: nanoid(),
                })
                const refreshToken = await refreshJwt.sign({ _random: nanoid() })
                // 记录 refreshToken(刷新令牌) 到 Redis，7天过期
                RedisClient.setEx(`sessions:${userJson.id}`, 3600 * 24 * 7, refreshToken)
                return createSuccessResponse(200, '登陆成功', {
                    user: userJson,
                    token,
                })
            } else {
                return createErrorResponse(401, '密码错误')
            }
        } catch (error) {
            return createErrorResponse(500, error)
        }
    },
    {
        body: t.Object({
            account: t.String(),
            password: t.String(),
        }),
    }
)

// 更新刷新令牌
AuthService.put('/sessions', async () => {
    
})
