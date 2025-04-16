import { RedisClient } from '@/db'
import bearer from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { createErrorResponse, ERROR_RESPONSE } from '@root/shared'
import Elysia, { t } from 'elysia'

export interface JwtPayload {
    id: string
    name: string
    account: string
    _random: string
    expiresAt: number
}

const JWT_Schema = t.Object({
    id: t.String(),
    name: t.String(),
    account: t.String(),
    _random: t.String(),
    expiresAt: t.Number(),
})

export const accessJwtPlugin = jwt({
    name: 'accessJwt',
    secret: 'YuzuTea_Access',
    alg: 'HS256',
    schema: JWT_Schema,
})

export const refreshJwtPlugin = jwt({
    name: 'refreshJwt',
    secret: 'YuzuTea_Refresh',
    alg: 'HS256',
    schema: JWT_Schema,
})

export const bearerPlugin = bearer()

/**
 * 认证插件的类型引用
 */
export const verifyPluginReference = new Elysia().state('user', {} as JwtPayload).state('token', '')

/**
 * 认证bearer的插件
 * @note 用于只需要token的接口
 * @param app Elysia 实例
 */
export function verifyBearerPlugin(app: Elysia) {
    return app.use(bearerPlugin).onBeforeHandle(async ({ bearer }) => {
        if (!bearer) {
            return createErrorResponse(1000, '需要token')
        }
    })
}

/**
 * 认证基础的插件
 * @param app Elysia 实例
 */
export function verifyBasePlugin(app: Elysia) {
    return app
        .use(bearerPlugin)
        .use(accessJwtPlugin)
        .use(refreshJwtPlugin)
        .use(verifyPluginReference)
}

/**
 * 认证普通用户的插件
 * @param app Elysia 实例
 */
export function verifyCommonUserPlugin(app: Elysia) {
    return app.use(verifyBasePlugin).onBeforeHandle(async ({ bearer, accessJwt, store }) => {
        if (!bearer) {
            return ERROR_RESPONSE.AUTH.MISSING_TOKEN
        }

        // 校验 token 是否合法
        const payload = await accessJwt.verify(bearer)
        if (!payload) {
            return ERROR_RESPONSE.AUTH.INVALID_TOKEN
        }

        // 检查令牌是否过期
        if (payload.expiresAt < Date.now()) {
            return ERROR_RESPONSE.AUTH.TOKEN_EXPIRED
        }

        // 检查会话是否有效
        if (!(await RedisClient.get(`sessions:${payload.id}`))) {
            return ERROR_RESPONSE.AUTH.INVALID_SESSION
        }

        store.user = payload
        store.token = bearer!
    })
}
