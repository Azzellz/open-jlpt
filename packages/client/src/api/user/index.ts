import type { AuthVoucher, User, UserCreateParams, UserQueryParams } from '@root/models'
import { handleAxiosRequest, createAuthorizationHeaders } from '@root/shared'
import { API_INSTANCE } from '..'

export async function getUsers(token: string, params?: UserQueryParams) {
    return handleAxiosRequest<Omit<User, 'password' | 'config'>>(() =>
        API_INSTANCE.get('/users', {
            params,
            ...createAuthorizationHeaders(token),
        }),
    )
}

export async function createUser(params: UserCreateParams) {
    return handleAxiosRequest<AuthVoucher>(() => API_INSTANCE.post('/users', params))
}
