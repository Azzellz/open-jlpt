import { API_INSTANCE } from '@/api'
import type { JLPT_Read, JLPT_ReadCreateParams, JLPT_ReadQueryParams } from '@root/models'
import { handleAxiosRequest } from '@root/shared'

export async function createRead(params: JLPT_ReadCreateParams) {
    return handleAxiosRequest<JLPT_Read>(() => API_INSTANCE.post('/jlpt/reads', params))
}

export async function deleteRead(id: string) {
    return handleAxiosRequest<null>(() => API_INSTANCE.delete(`/jlpt/reads/${id}/visible`))
}

export async function updateReadVisible(id: string, visible: boolean) {
    return handleAxiosRequest<null>(() =>
        API_INSTANCE.patch(`/jlpt/reads/${id}/visible`, {
            visible,
        }),
    )
}

export async function getReads(params?: JLPT_ReadQueryParams) {
    return handleAxiosRequest<JLPT_Read[]>(() => API_INSTANCE.get('/jlpt/reads', { params }))
}

export async function getRead(readID: string) {
    return handleAxiosRequest<JLPT_Read>(() => API_INSTANCE.get(`/jlpt/reads/${readID}`))
}
