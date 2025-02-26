import type { AuthParams, AuthVoucher } from '@root/models'
import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'

// 登录
export async function createAuthSession(params: AuthParams) {
    return await handleAxiosRequest<AuthVoucher>(() => API_INSTANCE.post('/auth/sessions', params))
}
