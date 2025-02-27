import API, { API_INSTANCE } from '@/api'
import type { User } from '@root/models/user'
import { isSuccessResponse } from '@root/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user-store', () => {
    const user = ref<Omit<User, 'password'> | null>(null)
    const token = ref('')

    // 自动注入令牌
    API_INSTANCE.interceptors.request.use((config) => {
        if (token.value) {
            config.headers.Authorization = `Bearer ${token.value}`
        }
        return config
    })

    // 无感刷新
    API_INSTANCE.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config

            // 检测到令牌过期且未进入刷新流程,令牌过期的code是1001
            if (error.response?.data?.code === 1001 && !originalRequest._retry && user.value) {
                // 标记一次重试
                originalRequest._retry = true

                // 发起刷新请求
                console.log('检测到令牌过期，尝试刷新令牌...')
                const result = await API.Auth.refreshAuthSession(user.value.id)
                if (isSuccessResponse(result)) {
                    token.value = result.data.token
                    localStorage.setItem('token', token.value)
                    console.log('刷新令牌成功！', result)
                } else {
                    // 刷新失败则重新登录
                    user.value = null
                    token.value = ''
                    localStorage.removeItem('token')
                }

                // 重试原始请求
                originalRequest.headers.Authorization = `Bearer ${token.value}`
                return API_INSTANCE(originalRequest)
            }

            return Promise.reject(error)
        },
    )

    return {
        user,
        token,
    }
})
