import { API_INSTANCE } from '@/api'
import type { JLPT_Read, JLPT_ReadCreateParams } from '@root/models'
import { handleAxiosRequest } from '@root/shared'

export async function updateReadVisible(id: string, visible: boolean) {
    return handleAxiosRequest<null>(() =>
        API_INSTANCE.patch(`/jlpt/reads/${id}/visible`, {
            visible,
        }),
    )
}

export async function createRead(params: JLPT_ReadCreateParams) {
    return handleAxiosRequest<JLPT_Read>(() => API_INSTANCE.post('/jlpt/reads', params))
}

export async function deleteRead(id: string) {
    return handleAxiosRequest<null>(() => API_INSTANCE.delete(`/jlpt/reads/${id}/visible`))
}
