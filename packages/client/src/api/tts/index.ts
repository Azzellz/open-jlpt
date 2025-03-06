import { createSuccessResponse, handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'

interface EdgeTTS_CreateParams {
    text: string
    voice: string
    volume?: string
    rate?: string
    pitch?: string
}
export async function createTTS(params: EdgeTTS_CreateParams) {
    return await handleAxiosRequest<Blob>(
        () =>
            API_INSTANCE.post('/tts/edge-tts', params, {
                responseType: 'blob',
            }),
        {
            onSuccess(response) {
                return createSuccessResponse(200, 'OK', response.data)
            },
        },
    )
}
