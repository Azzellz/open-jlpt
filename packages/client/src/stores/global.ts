import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getClientSize, getClientType } from '@/utils'

export const useGlobalStore = defineStore('global-store', () => {
    const clientType = ref<'desktop' | 'mobile'>(getClientType())
    const clientSize = ref<'sm' | 'md' | 'lg' | 'xl' | '2xl'>(getClientSize())
    document.addEventListener('resize', () => {
        clientSize.value = getClientSize()
    })

    return {
        clientType,
        clientSize,
    }
})
