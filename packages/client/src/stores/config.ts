import type { OpenJLPT_Config } from '@root/models'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config-store', () => {
    const config = ref<OpenJLPT_Config | null>(null)
    return {
        config,
    }
})
