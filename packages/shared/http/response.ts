import type { ErrorResponse, SuccessResponse, StandardResponse } from '@root/models'
import { isObject } from 'radash'

/**
 * 创建请求成功响应
 * @param code 响应代码
 * @param message 响应信息
 * @param data 响应数据
 */
export function createSuccessResponse<T>(
    code: number,
    message: string,
    data: T
): SuccessResponse<T> {
    return {
        code,
        message,
        data,
    }
}

/**
 * 创建请求错误响应
 * @param code 响应代码
 * @param error 响应错误
 */
export function createErrorResponse<U = string>(code: number, error: U): ErrorResponse<U> {
    return {
        code,
        error,
    }
}

/**
 * 判断是否为标准响应
 * @param response 要断言的响应对象
 */
export function isStandardResponse<T = any, U = any>(
    response: any
): response is StandardResponse<T, U> {
    if (!isObject(response)) {
        return false
    }

    if (response['code'] && (response['error'] || response['data'])) {
        return true
    } else {
        return false
    }
}

/**
 * 判断是否为标准成功响应
 * @param response 要断言的响应对象
 */
export function isSuccessResponse<T>(response: any): response is SuccessResponse<T> {
    return isStandardResponse(response) && typeof (response as any).error === 'undefined'
}

/**
 * 判断是否为标准失败响应
 * @param response 要断言的响应对象
 */
export function isErrorResponse<U>(response: any): response is ErrorResponse<U> {
    return isStandardResponse(response) && typeof (response as any).error !== 'undefined'
}

/**
 * 判断是否是合法的 http 状态代码：101或者[200,599]
 * @param code http状态代码
 */
export function isValidHttpStatusCode(code: number): boolean {
    return code === 101 || (code >= 200 && code <= 599)
}
