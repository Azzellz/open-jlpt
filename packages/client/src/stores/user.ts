import type { User } from '@root/models/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user-store', () => {
    const user = ref<Omit<User, 'password'> | null>(null)
    const accessToken = ref('')
    const refreshToken = ref('')
    return {
        user,
        accessToken,
        refreshToken,
    }
})
