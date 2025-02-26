import bearer from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { createErrorResponse } from '@root/shared'
import Elysia, { t } from 'elysia'

export interface AccessJwtPayload {
    id: string
    name: string
    account: string
    _random: string
}
export const accessJwtPlugin = jwt({
    name: 'accessJwt',
    secret: 'YuzuTea_Access',
    alg: 'HS256',
    exp: '2h', // 两小时
    schema: t.Object({
        id: t.String(),
        name: t.String(),
        account: t.String(),
        _random: t.String(),
    }),
})

export const refreshJwtPlugin = jwt({
    name: 'refreshJwt',
    secret: 'YuzuTea_Refresh',
    alg: 'HS256',
    exp: '1d', // 一天
    schema: t.Object({
        _random: t.String(),
    }),
})

export const bearerPlugin = bearer()

/**
 * 认证插件的类型引用
 */
export const verifyPluginReference = new Elysia()
    .state('user', {} as AccessJwtPayload)
    .state('token', '')

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
            return createErrorResponse(1000, '需要token')
        }

        // 校验token
        const payload = await accessJwt.verify(bearer)
        if (!payload) {
            return createErrorResponse(1001, '无效token')
        } else {
            store.user = payload
            store.token = bearer!
        }
    })
}
