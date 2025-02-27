import type { AuthParams, AuthVoucher } from '@root/models'
import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'

// 登录
export async function createAuthSession(params: AuthParams) {
    return await handleAxiosRequest<AuthVoucher>(() => API_INSTANCE.post('/auth/sessions', params))
}

// 刷新令牌
export async function refreshAuthSession(sessionID: string) {
    return await handleAxiosRequest<{ token: string }>(() =>
        API_INSTANCE.put(`/auth/sessions/${sessionID}`),
    )
}

// 注销
export async function deleteAuthSession(sessionID: string) {
    return await handleAxiosRequest<{ result: number }>(() =>
        API_INSTANCE.delete(`/auth/sessions/${sessionID}`),
    )
}
