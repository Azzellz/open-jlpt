/**
 * 请求成功响应
 */
export interface SuccessResponse<T> {
    code: number
    message: string
    data: T
}

/**
 * 请求错误响应
 */
export interface ErrorResponse<U = string> {
    code: number
    error: U
}

/**
 * 标准请求响应，既可能是成功响应，也可能是错误响应
 */
export type StandardResponse<T, U> = SuccessResponse<T> | ErrorResponse<U>
