import { createErrorResponse, isErrorResponse, isValidHttpStatusCode } from '@root/shared/http'
import Elysia from 'elysia'

/**
 * 响应规范插件，用于规范handler中的错误抛出和返回标准错误响应
 */
export const formatResponsePlugin = new Elysia()
    .onError({ as: 'global' }, ({ code, error, set }) => {
        // 如果抛出的是标准错误，则原样返回标准错误并且将http状态设置成标准错误中的code值
        if (isErrorResponse(error)) {
            // 如果是合法的http状态代码才同步，不然的话就是业务代码，不需要同步，一般是手动设置set.status
            set.status = isValidHttpStatusCode(error.code) ? error.code : 400
            return error
        }
        // Elysia内置错误处理
        if (code === 'NOT_FOUND') {
            return createErrorResponse(404, '未匹配对应路由')
        }
        return createErrorResponse(500, error || code)
    })
    .onAfterHandle({ as: 'global' }, ({ response, set }) => {
        // 如果是handler返回的是错误响应，则同步错误响应中的code和http状态码
        if (isErrorResponse(response)) {
            // 如果是合法的http状态代码才同步，不然的话就是业务代码，不需要同步，一般是手动设置set.status
            set.status = isValidHttpStatusCode(response.code) ? response.code : 400
            return response
        }
    })
