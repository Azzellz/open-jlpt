import { DB_UserModel, RedisClient } from '@/db'
import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia, { t } from 'elysia'
import bcrypt from 'bcryptjs'
import { pick } from 'radash'
import { accessJwtPlugin, refreshJwtPlugin } from '@/plugins'
import { generateAccessTokenPayload, generateRefreshTokenPayload } from '@/tools'
import { AUTH_CONSTANTS } from '@/constants/auth'

export const AuthService = new Elysia({ prefix: '/auth' })
    .use(accessJwtPlugin)
    .use(refreshJwtPlugin)

//#region 登录

AuthService.post(
    '/sessions',
    async ({ body, accessJwt, refreshJwt }) => {
        try {
            // 查询用户
            const user = await DB_UserModel.findOne({ account: body.account })
            if (!user) {
                return ERROR_RESPONSE.USER.NOT_FOUND
            }
            // 检查密码是否正确
            const isValidPassword = await bcrypt.compare(body.password, user.password)
            if (isValidPassword) {
                const userJson = user.toJSON()
                const userPayload = pick(userJson, ['id', 'name', 'account'])

                // 生成 tokens
                const token = await accessJwt.sign(generateAccessTokenPayload(userPayload))
                const refreshToken = await refreshJwt.sign(generateRefreshTokenPayload(userPayload))

                // 记录 refreshToken(刷新令牌) 到 Redis
                RedisClient.setEx(
                    `sessions:${userJson.id}`,
                    AUTH_CONSTANTS.JWT.EXPIRES_AT.REFRESH / 1000,
                    refreshToken
                )
                return createSuccessResponse(200, '登录成功', {
                    user: userJson,
                    token,
                })
            } else {
                return ERROR_RESPONSE.USER.INVALID_PASSWORD
            }
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: t.Object({
            account: t.String(),
            password: t.String(),
        }),
    }
)

//#endregion

//#region 更新刷新令牌

AuthService.put('/sessions/:id', async ({ params: { id }, refreshJwt, accessJwt }) => {
    const refreshToken = await RedisClient.get(`sessions:${id}`)
    const payload = await refreshJwt.verify(refreshToken || '')
    if (refreshToken && payload) {
        // 生成新的 accessToken
        const newAccessToken = await accessJwt.sign(generateAccessTokenPayload(payload))
        // 重置 redis 中的 refreshToken
        const newRefreshToken = await refreshJwt.sign(generateRefreshTokenPayload(payload))
        RedisClient.setEx(
            `sessions:${id}`,
            AUTH_CONSTANTS.JWT.EXPIRES_AT.REFRESH / 1000,
            newRefreshToken
        )
        return createSuccessResponse(200, '刷新成功', {
            token: newAccessToken,
        })
    } else {
        return ERROR_RESPONSE.AUTH.REFRESH_FAILED
    }
})

//#endregion

//#region 退出登录（注销）

AuthService.delete('/sessions/:id', async ({ params: { id } }) => {
    // result 是被成功删除的数量
    const result = await RedisClient.del(`sessions:${id}`)
    return createSuccessResponse(200, '注销成功', {
        result,
    })
})

//#endregion
