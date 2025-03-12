import type {
    AuthVoucher,
    User,
    UserCreateParams,
    UserQueryParams,
    UserUpdateParams,
} from '@root/models'
import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'

export async function getUsers(params?: UserQueryParams) {
    return handleAxiosRequest<Omit<User, 'password' | 'config'>>(() =>
        API_INSTANCE.get('/users', {
            params,
        }),
    )
}

export async function createUser(params: UserCreateParams) {
    return handleAxiosRequest<AuthVoucher>(() => API_INSTANCE.post('/users', params))
}

export async function getUser() {
    return handleAxiosRequest<Omit<User, 'password'>>(() => API_INSTANCE.get(`/users/self`))
}

export async function updateUser(params: Partial<UserUpdateParams>) {
    return handleAxiosRequest<UserUpdateParams>(() =>
        API_INSTANCE.put('/users/{{user.id}}', params),
    )
}

export * from './llm'
export * from './history'
