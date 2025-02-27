import API from '@/api'
import type { User } from '@root/models/user'
import { isErrorResponse } from '@root/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user-store', () => {
    const user = ref<Omit<User, 'password'> | null>(null)
    const token = ref('')

    API.use((response) => {
        // 无效Token，尝试刷新
        if (isErrorResponse(response.data) && response.data.code === 1001) {
        }
        return response
    })
    return {
        user,
        token,
    }
})
