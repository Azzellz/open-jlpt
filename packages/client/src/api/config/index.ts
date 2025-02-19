import { handleAxiosRequest } from '@root/shared'
import { API_INSTANCE } from '..'
import type { OpenJLPT_Config } from '@root/models'

/**
 * 初始化配置
 */
export async function initConfig() {
    return await handleAxiosRequest<null>(() => API_INSTANCE.post('/config/init'))
}

/**
 * 获取配置
 */
export async function getConfig() {
    return await handleAxiosRequest<OpenJLPT_Config>(() => API_INSTANCE.get('/config'))
}
