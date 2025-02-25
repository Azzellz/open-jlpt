import type { User } from '@root/models/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user-store', () => {
    const user = ref<User | null>(null)
    return {
        user,
    }
})
