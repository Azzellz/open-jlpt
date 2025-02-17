import type { SuccessResponse, ErrorResponse, StandardResponse } from '@root/models'
import { createSuccessResponse, createErrorResponse, isErrorResponse } from './response'
import { isAxiosError, type AxiosResponse } from 'axios'

/**
 * 默认的请求成功处理函数
 * @param response 请求响应
 */
function _defaultOnSuccess<T>(response: AxiosResponse<any>): SuccessResponse<T> {
    const code = parseInt(response.data.code) || 200
    const message = response.data.message || '请求成功'
    const data = response.data.data === void 0 ? null : response.data.data
    return createSuccessResponse(code, message, data)
}

/**
 * 默认的请求失败处理函数
 * @param result 结果
 */
function _defaultOnError<U>(result: unknown): ErrorResponse<U> {
    if (isAxiosError(result)) {
        if (result.response && isErrorResponse(result.response.data)) {
            return result.response.data as ErrorResponse<U>
        } else if (result.response) {
            return createErrorResponse(result.response.status, result.response.statusText as U)
        } else if (result.request) {
            return createErrorResponse(result.status || 500, ('网络错误: ' + result.message) as U)
        } else {
            return createErrorResponse(result.status || 500, ('未知错误: ' + result.message) as U)
        }
    } else if (!result) {
        return createErrorResponse(500, '未知错误' as U)
    } else if (isErrorResponse<U>(result)) {
        return result
    } else {
        return createErrorResponse(500, ('未知错误: ' + result) as U)
    }
}

/**
 * 默认的请求完成处理函数
 */
const _defaultOnFinal = () => {}

/**
 * 默认的请求处理选项
 */
const _defaultOptions = {
    onError: _defaultOnError,
    onSuccess: _defaultOnSuccess,
    onFinal: _defaultOnFinal,
    retry: false,
}

/**
 * 请求成功处理函数
 */
type OnSuccess<T> = (response: AxiosResponse<any>) => SuccessResponse<T> | void

/**
 * 请求失败处理函数
 */
type OnError<U> = (error: unknown | any) => ErrorResponse<U> | void

/**
 * 请求完成处理函数
 */
type OnFinal = () => void

/**
 * 请求生命周期选项
 */
interface RequestLifeCycleOptions<T, U> {
    onSuccess?: OnSuccess<T>
    onError?: OnError<U>
    onFinal?: OnFinal
}

/**
 * 请求处理选项
 */
interface HandleRequestOptions<T, U> extends RequestLifeCycleOptions<T, U> {
    /**
     * 请求重试的配置
     */
    retry?: number | boolean
}

/**
 * 请求包装器
 */
type AxiosRequestWrapper<T> = () => Promise<AxiosResponse<T>>

/**
 * 处理基于 Axios 的请求，可以把请求响应转化为指定格式，保证类型安全
 * @param request 请求包装器
 * @param options 选项
 */
export async function handleAxiosRequest<T, U = string>(
    request: AxiosRequestWrapper<T>,
    options: HandleRequestOptions<T, U> = _defaultOptions
): Promise<StandardResponse<T, U>> {
    const _options: Required<HandleRequestOptions<T, U>> = { ..._defaultOptions, ...options }

    let attempt = 0
    const maxAttempts = typeof _options.retry === 'number' ? _options.retry : 0

    // 重试循环
    while (attempt <= maxAttempts) {
        try {
            const response = await request()
            return _options.onSuccess?.(response) || _defaultOnSuccess(response)
        } catch (error: unknown) {
            if (attempt === maxAttempts) {
                return _options.onError?.(error) || _defaultOnError(error as U)
            } else {
                attempt++
            }
        } finally {
            _options.onFinal?.()
        }
    }

    const error = createErrorResponse(500, `重试请求失败，共重试${attempt}次`)
    return _options.onError?.(error) || _defaultOnError(error)
}

/**
 * 创建一个 Axios 请求头 Authorization 配置对象
 * @param token 请求令牌
 */
export function createAuthorizationHeaders(token: string) {
    return {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    }
}
