import type {
    AuthVoucher,
    User,
    UserCreateParams,
    UserQueryParams,
    UserUpdateParams,
} from '@root/models'
import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'
import type { LLM_ChatParams } from '@root/models'

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

export async function updateUser(userID: string, params: Partial<UserUpdateParams>) {
    return handleAxiosRequest<UserUpdateParams>(() => API_INSTANCE.put(`/users/${userID}`, params))
}

export async function chatWithLLM(
    userID: string,
    llmID: string,
    messages: LLM_ChatParams['messages'],
    onChunk: (chunk: string) => void,
) {
    const response = await API_INSTANCE.post(
        `/users/${userID}/llms/${llmID}/chat`,
        {
            isStream: true,
            messages,
        },
        {
            responseType: 'stream',
            adapter: 'fetch',
        },
    )
    const reader = response.data.getReader()
    const decoder = new TextDecoder()

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        onChunk(chunk)
    }
}
