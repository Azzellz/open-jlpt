import API, { API_INSTANCE } from '@/api'
import type { User, UserClientConfig, UserConfig } from '@root/models/user'
import { isSuccessResponse } from '@root/shared'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user-store', () => {
    const user = ref<Omit<User, 'password'> | null>(null)

    //#region 令牌

    const token = ref(localStorage.getItem('token') || '')
    function saveState(value: string) {
        localStorage.setItem('token', value)
        localStorage.setItem('user-id', user.value?.id || '')
        token.value = value
    }
    function removeState() {
        localStorage.removeItem('token')
        localStorage.removeItem('user-id')
        token.value = ''
    }

    API_INSTANCE.interceptors.request.use((config) => {
        // 自动注入令牌
        if (token.value) {
            config.headers.Authorization = `Bearer ${token.value}`
        }
        // 自动注入用户变量
        if (user.value) {
            config.url = config.url?.replace(/{{user.id}}/gi, user.value.id)
        }
        return config
    })

    // 无感刷新
    API_INSTANCE.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config
            const userId = localStorage.getItem('user-id')
            // 检测到令牌过期且未进入刷新流程,令牌过期的code是1001
            if (error.response?.data?.code === 1004 && !originalRequest._retry && userId) {
                // 标记一次重试
                originalRequest._retry = true

                // 发起刷新请求
                console.log('检测到令牌过期，尝试刷新令牌...')
                const result = await API.Auth.refreshAuthSession(userId)
                if (isSuccessResponse(result)) {
                    token.value = result.data.token
                    localStorage.setItem('token', token.value)
                    console.log('刷新令牌成功！', result)
                } else {
                    // 刷新失败则重新登录
                    user.value = null
                    token.value = ''
                    localStorage.removeItem('token')
                    localStorage.removeItem('user-id')
                }

                // 重试原始请求
                originalRequest.headers.Authorization = `Bearer ${token.value}`
                return API_INSTANCE(originalRequest)
            }

            return Promise.reject(error)
        },
    )

    //#endregion

    //#region 用户配置
    const remoteConfig = computed(() => user.value?.config)
    const localConfig = ref<UserConfig | null>(null)
    const mergedConfig = computed<UserClientConfig>(() => {
        return {
            llm: {
                default: localConfig.value!.llm.default || remoteConfig.value!.llm.default,
                items: [
                    ...(localConfig.value?.llm.items || []).map((item) => ({
                        ...item,
                        local: true,
                    })),
                    ...(remoteConfig.value?.llm.items || []).map((item) => ({
                        ...item,
                        local: false,
                    })),
                ],
            },
        }
    })
    function loadLocalConfig() {
        const local = localStorage.getItem('user-config')
        if (local) {
            localConfig.value = JSON.parse(local)
        } else {
            localConfig.value = {
                llm: {
                    items: [],
                    default: '',
                },
            }
        }
    }
    function saveLocalConfig() {
        localStorage.setItem('user-config', JSON.stringify(localConfig.value))
    }
    //#endregion

    return {
        user,
        token,
        saveState,
        removeState,
        remoteConfig,
        localConfig,
        mergedConfig,
        loadLocalConfig,
        saveLocalConfig,
    }
})
