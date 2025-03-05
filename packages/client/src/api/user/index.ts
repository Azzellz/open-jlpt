import type {
    AuthVoucher,
    JLPT_PracticeMap,
    JLPT_ReadCreateParams,
    User,
    UserCreateParams,
    UserQueryParams,
    UserUpdateParams,
} from '@root/models'
import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'
import type { LLM_ChatParams } from '@root/models'
import type {
    JLPT_PracticeCreateParamsMap,
    JLPT_PracticeCreateResponseMap,
} from '@root/models/jlpt/practice'

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

export async function chatWithLLM(
    llmID: string,
    params: {
        messages: LLM_ChatParams['messages']
        onContent?: (content: string) => void
        onReasoning?: (reasoning: string) => void
        onChunk?: (chunk: string) => void
    },
) {
    const { messages, onChunk, onContent, onReasoning } = params
    const response = await API_INSTANCE.post(
        `/users/{{user.id}}/llms/${llmID}/chat`,
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

    let isContentStage = false
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        onChunk?.(chunk)

        // 判断是推理阶段还是内容阶段，通过比较 chunk 是否等于特殊哈希字符串
        if (chunk === 'e7d974c7436c9a369b93fe49e405364b9bd3060a') {
            isContentStage = true
            continue
        }

        isContentStage ? onContent?.(chunk) : onReasoning?.(chunk)
    }
}

export async function createHistory<T extends keyof JLPT_PracticeMap>(
    type: T,
    params: JLPT_PracticeCreateParamsMap[T],
) {
    return handleAxiosRequest<JLPT_PracticeCreateResponseMap[T]>(() =>
        API_INSTANCE.post(`/users/{{user.id}}/histories/${type}`, params),
    )
}
