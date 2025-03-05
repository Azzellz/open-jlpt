import { DB_UserModel, RedisClient } from '@/db'
import { createErrorResponse, createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia, { t } from 'elysia'
import bcrypt from 'bcryptjs'
import {  pick } from 'radash'
import { accessJwtPlugin, refreshJwtPlugin } from '@/plugins'
import { nanoid } from 'nanoid'

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
                return ERROR_RESPONSE.SYSTEM.NOT_FOUND
            }
            // 检查密码是否正确
            const isValidPassword = await bcrypt.compare(body.password, user.password)
            if (isValidPassword) {
                const userJson = user.toJSON()
                const userPayload = pick(userJson, ['id', 'name', 'account'])
                // 生成 tokens
                const token = await accessJwt.sign({
                    ...userPayload,
                    _random: nanoid(),
                })
                const refreshToken = await refreshJwt.sign({ ...userPayload, _random: nanoid() })
                // 记录 refreshToken(刷新令牌) 到 Redis，7天过期
                RedisClient.setEx(`sessions:${userJson.id}`, 3600 * 24 * 7, refreshToken)
                return createSuccessResponse(200, '登录成功', {
                    user: userJson,
                    token,
                })
            } else {
                return createErrorResponse(401, '密码错误')
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
        const newAccessToken = await accessJwt.sign({
            ...payload,
            _random: nanoid(),
        })
        // 重置 redis 中的 refreshToken
        const newRefreshToken = await refreshJwt.sign({
            ...payload,
            _random: nanoid(),
        })
        RedisClient.setEx(`sessions:${id}`, 3600 * 24 * 7, newRefreshToken)
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
