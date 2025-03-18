import type {
    JLPT_PracticeMap,
    PaginationResult,
    UserHistoryCreateParams,
    UserHistoryQueryParams,
    UserHistoryRecord,
    JLPT_PracticeTypeMap,
} from '@root/models'
import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'

export async function createHistory<T extends keyof JLPT_PracticeMap>(
    type: T,
    params: UserHistoryCreateParams,
) {
    return handleAxiosRequest<UserHistoryRecord>(() =>
        API_INSTANCE.post(`/users/{{user.id}}/histories/${type}`, params),
    )
}

export async function deleteHistory<T extends keyof JLPT_PracticeMap>(type: T, id: string) {
    return handleAxiosRequest<null>(() =>
        API_INSTANCE.delete(`/users/{{user.id}}/histories/${type}/${id}`),
    )
}

export async function getHistories<T extends keyof JLPT_PracticeMap>(
    type: T,
    params?: UserHistoryQueryParams,
) {
    return handleAxiosRequest<
        PaginationResult<JLPT_PracticeTypeMap[T]> & { records: UserHistoryRecord[] }
    >(() =>
        API_INSTANCE.get(`/users/{{user.id}}/histories/${type}`, {
            params,
        }),
    )
}
